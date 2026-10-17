# Vacation Management

Local web app to submit and review vacation requests. The UI is branded **Leaveboard**.

- **Requester** — form + personal request list  
- **Validator** — all requests, filters, pagination, approve / reject (comment required on reject)  
- **Team planning** — both roles see pending and approved time off for the team  

**Stack:** Vue 3 (Composition API / `<script setup>`), Vue Router, Axios, Tailwind CSS, Node.js, Express, TypeORM, PostgreSQL, JWT, [commoneventframework](https://www.npmjs.com/package/commoneventframework).

Clone: `https://github.com/guyshilon/vacation-management.git`

## Prerequisites

- [Node.js](https://nodejs.org/) **22** (LTS is fine)  
- [PostgreSQL](https://www.postgresql.org/download/) **14+** running locally (port **5432**)  
- Two terminals: one for the API, one for the UI  

## 1. Database

Create a database named exactly `vacation_db`.

**pgAdmin:** right-click **Databases** → **Create** → **Database** → name `vacation_db`.

**psql** (optional):

```sql
CREATE DATABASE vacation_db;
```

UUID primary keys need the `uuid-ossp` extension (once, connected to `vacation_db`):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

If that command errors, your Postgres user may need permission to create extensions; the default `postgres` superuser can run it.

## 2. Backend (http://localhost:3000)

From the **repository root**:

```bash
cd backend
```

Copy env and put **your** Postgres password in `.env` (this file is not in git):

```bash
# Windows
copy .env.example .env

# macOS / Linux / Git Bash
cp .env.example .env
```

Edit `backend/.env`:

| Variable | What to set |
|---|---|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_USERNAME` | usually `postgres` |
| `DB_PASSWORD` | the password you set when installing Postgres |
| `DB_NAME` | `vacation_db` |
| `JWT_SECRET` | can stay as in the example for local use |
| `PORT` | `3000` |

Then:

```bash
npm install
npm run dev
```

Success looks like:

```
Connected to PostgreSQL
Server running on port 3000
```

The first start creates tables, demo users, and sample vacation requests so the review table and pagination are not empty. Later starts skip users that already exist, and skip extra sample requests if at least 12 rows are already there.

Alice is left with room to submit a new request (her sample row is a rejected past trip). Extra names in the list are other requesters for the team/review screens.

**If it fails**

| Message | Fix |
|---|---|
| `password authentication failed` | Wrong `DB_PASSWORD` / `DB_USERNAME` in `.env` |
| `database "vacation_db" does not exist` | Create the database (step 1) |
| `uuid_generate_v4` / extension error | Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` on `vacation_db` |

Keep this terminal running.

Optional API docs: http://localhost:3000/doc — health check: http://localhost:3000/health

## 3. Frontend (http://localhost:5173)

Open a **second** terminal at the **repository root**:

```bash
cd frontend
```

```bash
# Windows
copy .env.example .env

# macOS / Linux / Git Bash
cp .env.example .env
```

`VITE_API_URL=http://localhost:3000` is already correct for local use.

```bash
npm install
npm run dev
```

Open **http://localhost:5173** (not port 3000 — that is the API).

If login fails, the backend is usually not running.

## 4. Demo users

| Role | Email | Password |
|---|---|---|
| Requester | `requester@vacation.local` | `Password123` |
| Validator | `validator@vacation.local` | `Password123` |

Log **out** before switching accounts in the same browser.

The review list is filled with sample team requests (Maya, Noah, Sofia, Liam, Emma) so filters and page 2 have something to show. You only need the two accounts above for the walkthrough.

## 5. Suggested walkthrough

1. Sign in as the requester. Submit a request (end after start, not in the past, no overlap with another pending/approved request of yours).  
2. Open **Team planning**.  
3. Log out, sign in as the validator. Filter by status/employee, paginate, **Approve**, or **Reject** (comment required).  

## API (JWT on all routes except login and health)

| Method | Path | Who |
|---|---|---|
| `POST` | `/auth/login` | public |
| `GET` | `/auth/me` | any logged-in user |
| `GET` | `/users` | Validator |
| `POST` | `/vacation-requests` | Requester |
| `GET` | `/vacation-requests` | Requester: own rows. Validator: all, optional `status`, `user_id`, `page`, `limit`, `sort`, `order` |
| `GET` | `/vacation-requests/team` | both roles (Pending + Approved) |
| `POST` | `/vacation-requests/:id/approve` | Validator |
| `POST` | `/vacation-requests/:id/reject` | Validator (`comments` required) |

## Technical decisions

- **TypeORM** maps `User` and `VacationRequest` to PostgreSQL. `synchronize: true` creates tables on startup (homework only).  
- **JWT** from `POST /auth/login`; Vue Router and the API both enforce `Requester` / `Validator`.  
- **Commands + events** for writes (`CreateVacationRequestCommand`, `ApproveVacationRequestCommand`, `RejectVacationRequestCommand` and matching events). Business rules live in command handlers, not in Vue.  
- **Common Event Framework** routes HTTP via `backend/src/root.yaml` → `src/handlers/`. Express only listens on port 3000 (the package targets AWS Lambda).  
- **Vue 3 Composition API** with Router, Axios, Tailwind. Pages in `views/`, reusable UI in `components/` (table, search, filters, status badge, form, reject modal), HTTP in `api/`. Status/user filters and pagination are query params on the API. Header search filters the rows already on screen.  
- Same-day time off is allowed (`end_date` on or after `start_date`). Overlap ignores **Rejected** rows so a person can re-request those dates.

## Known limitations

- No user registration; demo accounts only.  
- `synchronize: true` is not for production (use migrations).  
- Domain events are logged in-process (no queue).  
- Team planning is a dated list, not a calendar widget.  
- Validator search does not query other pages — status/user filters and pagination are server-side.  
- CORS is open for local development.

## Layout

```
backend/    API (TypeORM, JWT, CEF handlers)
frontend/   Vue 3 UI
```
