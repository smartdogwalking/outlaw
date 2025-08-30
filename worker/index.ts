import { Hono } from "hono";
import { cors } from "hono/cors";
import authApp from "./auth";

type Bindings = {
  DB: D1Database;
  OPENAI_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  MOCHA_USERS_SERVICE_API_KEY?: string;
  MOCHA_USERS_SERVICE_API_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS - simple and clean
app.use('*', cors({
  origin: [
    'https://outlaw.app',
    'https://www.outlaw.app', 
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
}));

// Basic error handling
app.use('/api/*', async (c, next) => {
  try {
    await next();
  } catch (error) {
    console.error('API Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ===========================================
// AUTHENTICATION ROUTES
// ===========================================

// Mount auth routes
app.route('/api/auth', authApp);

// ===========================================
// AUTH MIDDLEWARE
// ===========================================

async function requireAuth(c: any, next: () => Promise<void>) {
  try {
    const { authMiddleware } = await import("@getmocha/users-service/backend");
    await authMiddleware(c, async () => {});
    
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }
    
    await next();
  } catch (error) {
    return c.json({ error: "Authentication failed" }, 401);
  }
}

// ===========================================
// BASIC ENDPOINTS
// ===========================================

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'OutLaw Backend',
    version: '1.0.0'
  });
});

// Root health check
app.get('/', (c) => {
  return c.json({ 
    status: 'OutLaw Backend Running',
    timestamp: new Date().toISOString()
  });
});

// User profile
app.get("/api/profile", requireAuth, async (c) => {
  const user = c.get("user");
  
  if (!user?.id) {
    return c.json({ error: "User not found" }, 401);
  }
  
  try {
    let profile = await c.env.DB.prepare(
      "SELECT * FROM user_profiles WHERE user_id = ?"
    ).bind(user.id).first();

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await c.env.DB.prepare(
        "INSERT INTO user_profiles (user_id) VALUES (?) RETURNING *"
      ).bind(user.id).first();
    }

    return c.json(profile);
  } catch (error) {
    console.error('Profile error:', error);
    return c.json({ error: "Failed to get profile" }, 500);
  }
});

// Update profile
app.put("/api/profile", requireAuth, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  
  if (!user?.id) {
    return c.json({ error: "User not found" }, 401);
  }
  
  try {
    const profile = await c.env.DB.prepare(`
      UPDATE user_profiles 
      SET law_school_id = ?, year_of_study = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
      RETURNING *
    `).bind(
      body.law_school_id || null, 
      body.year_of_study || null, 
      user.id
    ).first();

    return c.json(profile);
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Get law schools
app.get("/api/law-schools", async (c) => {
  try {
    const schools = await c.env.DB.prepare(
      "SELECT * FROM law_schools ORDER BY name"
    ).all();

    return c.json(schools.results || []);
  } catch (error) {
    return c.json([]);
  }
});

// Search law schools
app.get("/api/law-schools/search", async (c) => {
  try {
    const query = c.req.query('q') || '';
    
    if (query.length < 2) {
      const schools = await c.env.DB.prepare(
        "SELECT * FROM law_schools ORDER BY name LIMIT 50"
      ).all();
      return c.json(schools.results || []);
    }
    
    const schools = await c.env.DB.prepare(
      "SELECT * FROM law_schools WHERE name LIKE ? ORDER BY name LIMIT 50"
    ).bind(`%${query}%`).all();

    return c.json(schools.results || []);
  } catch (error) {
    return c.json([]);
  }
});

// ===========================================
// PROFESSOR MANAGEMENT
// ===========================================

// Get professors
app.get("/api/professors", requireAuth, async (c) => {
  try {
    const professors = await c.env.DB.prepare(
      "SELECT * FROM professors ORDER BY name"
    ).all();

    return c.json(professors.results || []);
  } catch (error) {
    return c.json([]);
  }
});

// Create professor
app.post("/api/professors", requireAuth, async (c) => {
  const body = await c.req.json();
  
  try {
    if (!body.name || !body.law_school_id) {
      return c.json({ error: "Name and law school required" }, 400);
    }

    const professor = await c.env.DB.prepare(`
      INSERT INTO professors (name, law_school_id, department, specialties)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `).bind(
      body.name.trim(),
      body.law_school_id,
      body.department?.trim() || null,
      body.specialties?.trim() || null
    ).first();

    return c.json(professor);
  } catch (error) {
    console.error('Professor creation error:', error);
    return c.json({ error: "Failed to create professor" }, 500);
  }
});

// ===========================================
// PROFESSOR CLONES MANAGEMENT
// ===========================================

// Get professor clones for user
app.get("/api/professor-clones", requireAuth, async (c) => {
  const user = c.get("user");
  
  if (!user?.id) {
    return c.json({ error: "User not found" }, 401);
  }
  
  try {
    const clones = await c.env.DB.prepare(`
      SELECT pc.*, p.name as professor_name, ls.name as school_name
      FROM professor_clones pc
      LEFT JOIN professors p ON pc.professor_id = p.id
      LEFT JOIN law_schools ls ON p.law_school_id = ls.id
      WHERE pc.user_id = ? AND pc.is_active = 1
      ORDER BY pc.created_at DESC
    `).bind(user.id).all();

    return c.json(clones.results || []);
  } catch (error) {
    console.error('Clone fetch error:', error);
    return c.json([]);
  }
});

// Create professor clone
app.post("/api/professor-clones", requireAuth, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  
  if (!user?.id) {
    return c.json({ error: "User not found" }, 401);
  }
  
  try {
    if (!body.professor_id || !body.course_name) {
      return c.json({ error: "Professor ID and course name required" }, 400);
    }

    // Create the clone
    const clone = await c.env.DB.prepare(`
      INSERT INTO professor_clones (
        user_id, professor_id, course_name, syllabus_content, lecture_notes,
        additional_materials, practice_questions, past_exams
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      user.id,
      body.professor_id,
      body.course_name.trim(),
      body.syllabus_content || null,
      body.lecture_notes || null,
      body.additional_materials || null,
      body.practice_questions || null,
      body.past_exams || null
    ).first();

    // Create questionnaire response if provided
    if (body.questionnaire_data && clone) {
      const q = body.questionnaire_data;
      await c.env.DB.prepare(`
        INSERT INTO professor_questionnaire_responses (
          professor_clone_id, humor_level, strictness_level, legal_interpretation_style,
          exam_format_preference, technology_usage, professor_quirks_and_hints
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        clone.id,
        q.humor_level || null,
        q.strictness_level || null,
        q.legal_interpretation_style || null,
        q.exam_format_preference || null,
        q.technology_usage || null,
        q.professor_quirks_and_hints || null
      ).run();
    }

    return c.json(clone);
  } catch (error) {
    console.error('Clone creation error:', error);
    return c.json({ error: "Failed to create professor clone" }, 500);
  }
});

// ===========================================
// SUBSCRIPTION MANAGEMENT
// ===========================================

// Get user subscription
app.get("/api/subscription", requireAuth, async (c) => {
  const user = c.get("user");
  
  if (!user?.id) {
    return c.json({ error: "User not found" }, 401);
  }
  
  try {
    let subscription = await c.env.DB.prepare(
      "SELECT * FROM user_subscriptions WHERE user_id = ?"
    ).bind(user.id).first();

    if (!subscription) {
      // Create free subscription if none exists
      subscription = await c.env.DB.prepare(`
        INSERT INTO user_subscriptions (user_id, subscription_type, is_active)
        VALUES (?, 'free', 1)
        RETURNING *
      `).bind(user.id).first();
    }

    return c.json(subscription);
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return c.json({ subscription_type: 'free', is_active: true });
  }
});

// ===========================================
// AI CHAT AND PREDICTIONS
// ===========================================

// Professor chat
app.post("/api/professor-chat", requireAuth, async (c) => {
  const body = await c.req.json();
  
  try {
    if (!body.clone_id || !body.message) {
      return c.json({ error: "Clone ID and message required" }, 400);
    }

    // Get clone details
    const clone = await c.env.DB.prepare(`
      SELECT pc.*, p.name as professor_name, p.specialties
      FROM professor_clones pc
      LEFT JOIN professors p ON pc.professor_id = p.id
      WHERE pc.id = ?
    `).bind(body.clone_id).first();

    if (!clone) {
      return c.json({ error: "Professor clone not found" }, 404);
    }

    // Generate AI response (mock for now)
    const response = `As Professor ${clone.professor_name}, I appreciate your question about ${clone.course_name}. Let me help you understand this concept better. ${body.message.includes('exam') ? 'For exam preparation, focus on the key principles and how they apply to practical scenarios.' : 'This is an important topic that often appears in legal practice.'} Feel free to ask follow-up questions!`;

    return c.json({ response });
  } catch (error) {
    console.error('Professor chat error:', error);
    return c.json({ response: "I'm having trouble responding right now. Please try again." });
  }
});

// Cold call prediction
app.post("/api/cold-call-prediction", requireAuth, async (c) => {
  const body = await c.req.json();
  
  try {
    if (!body.topic) {
      return c.json({ error: "Topic required" }, 400);
    }

    // Generate mock cold call response
    const response = {
      answer: `Great question about ${body.topic}. The key legal principle here involves analyzing the facts, applying the relevant law, and considering the policy implications. I would approach this by first identifying the central issue, then examining how courts have handled similar cases.`,
      tone: "confident and analytical",
      key_points: [
        "Identify the central legal issue",
        "Apply relevant case law and statutes", 
        "Consider policy implications",
        "Address potential counterarguments"
      ],
      follow_up_questions: [
        "What are the key facts that matter most here?",
        "How does this compare to similar cases we've studied?",
        "What policy concerns might influence the court's decision?"
      ]
    };

    return c.json(response);
  } catch (error) {
    console.error('Cold call prediction error:', error);
    return c.json({ error: "Failed to generate prediction" }, 500);
  }
});

// Case analysis
app.post("/api/case-analysis", requireAuth, async (c) => {
  const body = await c.req.json();
  
  try {
    if (!body.case_name) {
      return c.json({ error: "Case name required" }, 400);
    }

    // Generate mock case analysis
    const analysis = {
      case_name: body.case_name,
      facts: `The key facts in ${body.case_name} involve complex legal issues that require careful analysis.`,
      holding: "The court held that the legal principle applies when specific conditions are met.",
      reasoning: "The court's reasoning was based on precedent, statutory interpretation, and policy considerations.",
      significance: "This case is significant because it clarifies important legal principles in this area of law.",
      potential_questions: [
        `What are the key facts in ${body.case_name}?`,
        "How does this case compare to previous precedent?",
        "What policy considerations influenced the court's decision?",
        "What are the implications for future cases?"
      ]
    };

    return c.json(analysis);
  } catch (error) {
    console.error('Case analysis error:', error);
    return c.json({ error: "Failed to analyze case" }, 500);
  }
});

// Exam prediction
app.get("/api/exam-prediction/:cloneId", requireAuth, async (c) => {
  const cloneId = c.req.param('cloneId');
  
  try {
    // Get clone details
    const clone = await c.env.DB.prepare(`
      SELECT pc.*, p.name as professor_name
      FROM professor_clones pc
      LEFT JOIN professors p ON pc.professor_id = p.id
      WHERE pc.id = ?
    `).bind(cloneId).first();

    if (!clone) {
      return c.json({ error: "Professor clone not found" }, 404);
    }

    // Generate mock exam prediction
    const prediction = {
      accuracy_percentage: 87,
      total_topics: 12,
      high_probability_topics: [
        { name: "Constitutional Analysis", probability: 95, weight: 30 },
        { name: "Case Law Application", probability: 88, weight: 25 },
        { name: "Statutory Interpretation", probability: 82, weight: 20 }
      ],
      question_types: [
        { type: "Essay Questions", percentage: 60, count: 3 },
        { type: "Short Answer", percentage: 25, count: 5 },
        { type: "Multiple Choice", percentage: 15, count: 10 }
      ],
      difficulty_distribution: {
        easy: 25,
        medium: 50,
        hard: 25
      },
      study_recommendations: [
        "Focus heavily on constitutional analysis frameworks",
        "Review major case law and holdings",
        "Practice applying statutes to fact patterns",
        "Understand policy implications of legal decisions"
      ]
    };

    return c.json(prediction);
  } catch (error) {
    console.error('Exam prediction error:', error);
    return c.json({ error: "Failed to generate exam prediction" }, 500);
  }
});

// ===========================================
// SAVED MATERIALS
// ===========================================

// Get saved materials
app.get("/api/saved-materials/:cloneId", requireAuth, async (c) => {
  const user = c.get("user");
  const cloneId = c.req.param('cloneId');
  
  if (!user?.id) {
    return c.json({ error: "User not found" }, 401);
  }
  
  try {
    const materials = await c.env.DB.prepare(`
      SELECT * FROM saved_materials 
      WHERE user_id = ? AND professor_clone_id = ?
      ORDER BY created_at DESC
    `).bind(user.id, cloneId).all();

    return c.json(materials.results || []);
  } catch (error) {
    console.error('Saved materials fetch error:', error);
    return c.json([]);
  }
});

// Save material
app.post("/api/save-material", requireAuth, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  
  if (!user?.id) {
    return c.json({ error: "User not found" }, 401);
  }
  
  try {
    if (!body.professor_clone_id || !body.content) {
      return c.json({ error: "Professor clone ID and content required" }, 400);
    }

    const material = await c.env.DB.prepare(`
      INSERT INTO saved_materials (
        user_id, professor_clone_id, content, title, material_type, topic
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      user.id,
      body.professor_clone_id,
      body.content.trim(),
      body.title?.trim() || null,
      body.material_type || 'chat_response',
      body.topic?.trim() || null
    ).first();

    return c.json(material);
  } catch (error) {
    console.error('Save material error:', error);
    return c.json({ error: "Failed to save material" }, 500);
  }
});

// ===========================================
// BASIC ENDPOINTS
// ===========================================

// Basic contact form
app.post("/api/contact", async (c) => {
  const body = await c.req.json();
  
  try {
    if (!body.name || !body.email || !body.message) {
      return c.json({ error: "Name, email, and message required" }, 400);
    }

    await c.env.DB.prepare(`
      INSERT INTO contact_messages (name, email, subject, message, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      body.name.trim(),
      body.email.trim().toLowerCase(),
      body.subject?.trim() || '',
      body.message.trim(),
      c.req.header('cf-connecting-ip') || 'unknown'
    ).run();
    
    return c.json({ 
      success: true, 
      message: "Thank you! We'll get back to you within 24 hours." 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

// Demo leads
app.post("/api/demo-leads", async (c) => {
  const body = await c.req.json();
  
  try {
    if (!body.name || !body.email) {
      return c.json({ error: "Name and email required" }, 400);
    }

    await c.env.DB.prepare(`
      INSERT INTO demo_leads (name, email)
      VALUES (?, ?)
    `).bind(body.name.trim(), body.email.trim()).run();

    return c.json({ success: true, message: "Welcome to the demo!" });
  } catch (error) {
    return c.json({ error: "Failed to save demo access" }, 500);
  }
});

// Chatbot response
app.post("/api/lex-chat", requireAuth, async (c) => {
  const body = await c.req.json();
  
  if (!body.message) {
    return c.json({ error: "Message required" }, 400);
  }

  // Generate contextual response based on message content
  let response = "Thanks for your question! ";
  
  const message = body.message.toLowerCase();
  
  if (message.includes('clone') || message.includes('professor')) {
    response += "To create professor clones, go to your dashboard and click 'Create Clone'. Upload your syllabus and course materials, then answer questions about your professor's teaching style.";
  } else if (message.includes('exam') || message.includes('prediction')) {
    response += "OutLaw's exam predictions analyze your professor's past exams and teaching patterns to predict what will be on your final with 87% accuracy. Create a professor clone first to get personalized predictions.";
  } else if (message.includes('study') || message.includes('material')) {
    response += "OutLaw generates personalized study materials like flashcards, hypotheticals, and practice questions based on your professor's teaching style and course content.";
  } else if (message.includes('cold call') || message.includes('emergency')) {
    response += "The Cold Call Emergency feature gives you instant, perfect answers during class when your professor calls on you. Just describe the topic and get an immediate response in your professor's style.";
  } else if (message.includes('premium') || message.includes('upgrade')) {
    response += "Premium gives you unlimited professor clones, unlimited chat messages, advanced exam predictions, and priority support. You can upgrade from your dashboard.";
  } else if (message.includes('price') || message.includes('cost')) {
    response += "OutLaw is free to start with basic features. Premium is $9.99/month for unlimited access to all features including unlimited professor clones and chat.";
  } else {
    response += "I'm here to help with any questions about OutLaw! You can ask me about creating professor clones, exam predictions, study materials, cold call help, or premium features.";
  }

  return c.json({ response });
});

// Demo chat response
app.post("/api/demo/chat", async (c) => {
  const body = await c.req.json();
  
  const responses = [
    "Great question! In constitutional law, we need to consider the balance between federal and state power.",
    "That's exactly the kind of analysis I look for on exams. Let me break this down further...",
    "This case is particularly important because it established the framework we still use today.",
    "I can see you're thinking critically about this issue. Here's how I would approach it..."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return c.json({ 
    response: `As your Constitutional Law professor, ${randomResponse} ${body.message.includes('exam') ? 'For your upcoming exam, focus on the three-part test we discussed in class.' : 'Keep asking these thoughtful questions!'}`
  });
});

// Error handling for development
app.get("/api/debug/user", requireAuth, async (c) => {
  const user = c.get("user");
  return c.json({ 
    user: user,
    timestamp: new Date().toISOString(),
    backend_status: "working"
  });
});

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Bindings>;
