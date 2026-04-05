ALTER TABLE site_settings
  ADD COLUMN plan TEXT NOT NULL DEFAULT 'BASIC'
  CONSTRAINT site_settings_plan_check CHECK (plan IN ('BASIC', 'PRO'));

UPDATE site_settings SET plan = 'BASIC' WHERE id = 1;
