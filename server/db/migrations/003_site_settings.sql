CREATE TABLE IF NOT EXISTS site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CONSTRAINT site_settings_single_row CHECK (id = 1),
  academy_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  map_embed_url TEXT
);

INSERT INTO site_settings (id, academy_name, email, phone, address, map_embed_url)
VALUES (
  1,
  'G10 AMR Music Academy',
  'admissions@g10amr.edu',
  '+91 98765 43210',
  'Home studio, Trivandrum, Kerala',
  'https://maps.google.com/maps?q=Thiruvananthapuram%2C%20Kerala&t=m&z=12&output=embed&iwloc=near'
)
ON CONFLICT (id) DO NOTHING;
