# PostgreSQL backups (G10)

The server uses **PostgreSQL** via `DATABASE_URL` (see `server/.env.example`). This guide covers **manual exports** and **optional automation** so you can recover from mistakes or provider issues.

## Prerequisites

Install PostgreSQL **client** tools (`pg_dump`, `pg_restore`, `psql`) on the machine that runs the backup:

| Environment | Install |
|---------------|---------|
| macOS | `brew install libpq` → add `$(brew --prefix libpq)/bin` to `PATH` |
| Debian/Ubuntu | `sudo apt install postgresql-client` |
| Windows | Use [WSL](https://learn.microsoft.com/windows/wsl/) with `postgresql-client`, or install [PostgreSQL](https://www.postgresql.org/download/windows/) and use its `bin` tools |

Railway and other hosts often expose **`DATABASE_URL`** in the service variables. Use the **same** URL the app uses (SSL is handled by `pg` in Node; `pg_dump` may need `?sslmode=require` in the URL if your provider requires it—Railway URLs usually include SSL parameters).

## 1. Manual export (baseline you should know)

Never paste real passwords into chat logs or commit dump files to git.

### Option A — Custom format (recommended)

Single compressed file; supports parallel restore and selective restore.

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DATABASE'

pg_dump "$DATABASE_URL" -Fc --no-owner --no-acl \
  -f "g10-backup-$(date +%Y%m%d-%H%M%S).dump"
```

### Option B — Plain SQL

Human-readable; larger; restore with `psql`.

```bash
pg_dump "$DATABASE_URL" --no-owner --no-acl \
  -f "g10-backup-$(date +%Y%m%d).sql"
```

### From PowerShell (Windows)

```powershell
$env:DATABASE_URL = "postgresql://..."
pg_dump $env:DATABASE_URL -Fc --no-owner --no-acl -f "g10-backup.dump"
```

## 2. Restore (sanity check)

Test restores on a **separate database** before relying on a backup.

**Custom dump:**

```bash
pg_restore -d "$DATABASE_URL" --clean --if-exists backup.dump
```

**Plain SQL:**

```bash
psql "$DATABASE_URL" -f backup.sql
```

## 3. Security checklist

- **Do not** commit `*.dump`, `*.sql`, or `.env` with production credentials.
- Store extra copies **encrypted** (e.g. disk encryption, or `gpg -c backup.dump`) if you move them off a trusted machine.
- Restrict who can read `DATABASE_URL` in CI or backup runners.
- If a dump might have leaked, **rotate** the DB password and redeploy.

## 4. Optional: Railway

1. **Platform backups**  
   Check your Railway plan and [Railway Postgres backup / PITR documentation](https://docs.railway.com/databases/postgresql) for what is included (varies by plan).

2. **Cron-style jobs on Railway**  
   - Use a **Cron Job** (or separate small service) that runs on a schedule and executes `pg_dump`, **or**  
   - Trigger an external workflow (see below) on a schedule.

3. **Where to put files**  
   Long-term retention: upload dumps to **S3**, **Cloudflare R2**, **Backblaze B2**, etc., with a lifecycle policy—not only the runner’s local disk.

## 5. Optional: GitHub Actions (scheduled dump)

A template workflow is in **`docs/github-actions-db-backup.example.yml`**.

1. Copy it to `.github/workflows/db-backup.yml` (or merge into your own workflow).
2. Add a repository secret **`DATABASE_URL`** with your production connection string (read-only user is better if you only run `pg_dump`).
3. Uncomment the `schedule` block when you are ready for daily runs.
4. **Artifacts** in the example are short-lived; for real DR, add a step to upload the dump to object storage.

## 6. Restore flow after data loss

1. Create or empty a Postgres database (same schema as `server/db/schema.sql` if starting fresh).
2. Run **`pg_restore`** or **`psql`** as above against that database.
3. Point `DATABASE_URL` at the recovered DB and restart the API.

---

**Summary:** Run `pg_dump` regularly, verify restores occasionally, and keep copies **off** the primary DB host with encryption and access control.
