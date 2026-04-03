-- Assessment registry (config-driven; synced from code)

CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS tests_slug_idx ON tests (slug);
