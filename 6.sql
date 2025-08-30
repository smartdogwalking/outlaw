
CREATE TABLE study_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  professor_clone_id INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  materials_studied INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  session_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
