CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT,
  title TEXT,
  bio TEXT,
  photo_url TEXT,
  student_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name TEXT,
  subject TEXT,
  studio TEXT,
  is_live BOOLEAN DEFAULT false,
  meeting_link TEXT
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT,
  photo TEXT,
  subject TEXT,
  class_id INT REFERENCES classes (id) ON DELETE SET NULL
);

ALTER TABLE users
  ADD CONSTRAINT users_student_id_fkey
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE SET NULL;

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INT,
  date DATE,
  status TEXT,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students (id)
);

CREATE TABLE performance (
  id SERIAL PRIMARY KEY,
  student_id INT,
  score TEXT,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_performance_student FOREIGN KEY (student_id) REFERENCES students (id)
);

-- Config-driven assessments (rows upserted by server/lib/syncTests.js)
CREATE TABLE tests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CONSTRAINT site_settings_single_row CHECK (id = 1),
  academy_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  map_embed_url TEXT,
  home_hero_title TEXT NOT NULL DEFAULT '',
  home_hero_subtitle TEXT NOT NULL DEFAULT '',
  about_text TEXT NOT NULL DEFAULT '',
  contact_intro TEXT NOT NULL DEFAULT '',
  admissions_message TEXT NOT NULL DEFAULT ''
);

INSERT INTO site_settings (id, academy_name, email, phone, address, map_embed_url)
VALUES (
  1,
  'G10 AMR Music Academy',
  'admissions@g10amr.edu',
  '+91 98765 43210',
  'Home studio, Trivandrum, Kerala',
  'https://maps.google.com/maps?q=Thiruvananthapuram%2C%20Kerala&t=m&z=12&output=embed&iwloc=near'
);

CREATE TABLE enquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  course TEXT NOT NULL,
  message TEXT,
  age TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery_items (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'classes',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT gallery_items_category_check CHECK (category IN ('classes', 'performances', 'studio'))
);

CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  user_id INT REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
