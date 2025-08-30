
CREATE TABLE study_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  professor_clone_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'flashcard', 'hypothetical', 'quiz', 'model_answer'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1, -- 1-5 scale
  topic TEXT,
  is_mastered BOOLEAN DEFAULT 0,
  last_reviewed_at TIMESTAMP,
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
