-- Link students to classes (for filtering attendance / roster by class).

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS class_id INT REFERENCES classes (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS students_class_id_idx ON students (class_id);
