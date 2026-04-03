# Music Academy App

Production-style layout:

```
music-academy-app/   (this repo root)
  client/            React + Vite + Tailwind → `client/dist`
  server/            Node.js + Express + PostgreSQL
```

## Quick start

```bash
# Install dependencies (run in repo root)
npm run install:all

# Frontend dev
npm run dev

# API dev (set server/.env from server/.env.example first)
npm run dev:server
```

## Environment

- **Client:** copy `client/.env.example` → `client/.env` and set `VITE_API_URL` to your deployed API base URL (no trailing slash).
- **Server:** copy `server/.env.example` → `server/.env` and set `DATABASE_URL`, `JWT_SECRET`, `PORT`.

## Database

Run `server/db/schema.sql` in your PostgreSQL (e.g. Railway SQL console). If the database already exists, apply new columns from `server/db/migrations/` in order (e.g. `010_site_settings_cms.sql` adds public CMS fields on `site_settings`; `011_activity_logs.sql` adds admin audit logging).

### Back up your database (recommended)

See **[docs/DATABASE_BACKUPS.md](docs/DATABASE_BACKUPS.md)** for `pg_dump` / restore and optional Railway or GitHub Actions cron.

## Production build (client)

```bash
cd client
npm run build
```

Output: `client/dist/`.

## Git (example)

```bash
git init
git add .
git commit -m "Production build"
git branch -M main
git remote add origin https://github.com/your-username/music-app.git
git push -u origin main
```

Railway: deploy **server** with root directory `server`, **client** with root directory `client`, build `npm run build`, start `npm run preview`, and set `VITE_API_URL` to your API URL.
