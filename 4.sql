
CREATE TABLE professor_clones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  professor_id INTEGER NOT NULL,
  course_name TEXT NOT NULL,
  syllabus_content TEXT,
  lecture_notes TEXT,
  ai_personality_prompt TEXT,
  exam_prediction_data TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
