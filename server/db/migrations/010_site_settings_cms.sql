-- CMS-style copy fields (single site_settings row). Safe to run on existing DBs.
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS home_hero_title TEXT NOT NULL DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS home_hero_subtitle TEXT NOT NULL DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_text TEXT NOT NULL DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_intro TEXT NOT NULL DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS admissions_message TEXT NOT NULL DEFAULT '';
