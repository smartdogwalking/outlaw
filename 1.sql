
CREATE TABLE law_schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO law_schools (name, slug) VALUES 
('Harvard Law School', 'harvard'),
('Yale Law School', 'yale'),
('Stanford Law School', 'stanford'),
('Columbia Law School', 'columbia'),
('University of Chicago Law School', 'uchicago'),
('New York University School of Law', 'nyu'),
('University of Pennsylvania Law School', 'upenn'),
('University of Virginia School of Law', 'uva'),
('Northwestern Pritzker School of Law', 'northwestern'),
('University of California Berkeley School of Law', 'berkeley');
