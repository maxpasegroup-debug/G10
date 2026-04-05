-- Link portal users to a students row (student / parent logins).
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id INTEGER;

ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_student;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_student_id_fkey;

ALTER TABLE users
  ADD CONSTRAINT fk_users_student
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE SET NULL;
