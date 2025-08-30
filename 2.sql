
CREATE TABLE professors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  law_school_id INTEGER NOT NULL,
  email TEXT,
  department TEXT,
  specialties TEXT,
  teaching_style TEXT,
  personality_traits TEXT,
  rate_my_professor_url TEXT,
  publications_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
