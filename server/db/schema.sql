CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT,
  photo TEXT,
  subject TEXT
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INT,
  date DATE,
  status TEXT
);

CREATE TABLE performance (
  id SERIAL PRIMARY KEY,
  student_id INT,
  score TEXT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name TEXT,
  subject TEXT,
  studio TEXT,
  is_live BOOLEAN DEFAULT false
);
