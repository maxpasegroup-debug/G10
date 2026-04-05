-- Enforce attendance / performance rows reference real students (no orphan student_id).
-- If this fails, remove or fix rows where student_id is not null and not in students(id).

ALTER TABLE attendance DROP CONSTRAINT IF EXISTS fk_attendance_student;
ALTER TABLE attendance
  ADD CONSTRAINT fk_attendance_student
  FOREIGN KEY (student_id) REFERENCES students (id);

ALTER TABLE performance DROP CONSTRAINT IF EXISTS fk_performance_student;
ALTER TABLE performance
  ADD CONSTRAINT fk_performance_student
  FOREIGN KEY (student_id) REFERENCES students (id);
