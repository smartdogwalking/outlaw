
-- Remove all the newly added law schools (keep only original 10)
DELETE FROM law_schools WHERE id > 10;
