# Vacation Management

Web app for submitting and reviewing vacation requests.

- **Requester** — submit requests and see their own history  
- **Validator** — filter, paginate, approve or reject (a comment is required to reject)  
- **Team planning** — both roles can see pending and approved time off across the team  

**Stack:** Vue 3, Vue Router, Axios, Tailwind CSS, Node.js, TypeORM, PostgreSQL, JWT, [commoneventframework](https://www.npmjs.com/package/commoneventframework).

## Prerequisites

- Node.js 22+  
- PostgreSQL 15+ (local)  
- Two terminals (API + UI)

## Database setup

1. Create an empty database named `vacation_db` (pgAdmin or `psql`).  
2. Copy backend env and set **your** Postgres password:

```bash
cd backend
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`. Edit `backend/.env`:

- `DB_USERNAME` / `DB_PASSWORD` — your local Postgres user  
- `DB_NAME=vacation_db`  
- `JWT_SECRET` — any long random string is fine for local use  

Tables are created automatically on first API start (`synchronize: true`). Demo users are seeded if they do not exist.

## Run

**Backend** (port 3000):

```bash
cd backend
npm install
npm run dev
```

Wait for `Connected to PostgreSQL` and `Server running on port 3000`.

**Frontend** (port 5173):

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

API docs from Common Event Framework: [http://localhost:3000/doc](http://localhost:3000/doc).

## Demo users

| Role | Email | Password |
|---|---|---|
| Requester | `requester@vacation.local` | `Password123` |
| Validator | `validator@vacation.local` | `Password123` |

## What to try

1. Log in as the requester, submit a vacation (end date after start, not in the past, no overlap).  
2. Open **Team planning**.  
3. Log in as the validator, filter the list, approve or reject (reject needs a comment).  

## Technical decisions

- **PostgreSQL + TypeORM** map `User` and `VacationRequest` entities to tables.  
- **JWT** after `/auth/login`; role (`Requester` / `Validator`) is enforced on protected routes.  
- **Commands and domain events** handle writes (`CreateVacationRequestCommand`, `ApproveVacationRequestCommand`, `RejectVacationRequestCommand` and matching events). Business rules live in command handlers, not in Vue.  
- **Common Event Framework** owns HTTP routing (`backend/src/root.yaml` → `handlers/`). Express only listens locally (the package is aimed at AWS Lambda).  
- **Vue 3** with Router, Axios, and Tailwind. Pages in `views/`, reusable UI in `components/`, HTTP in `api/`. Pagination and filters are query params on the API.

## Known limitations

- `synchronize: true` is convenient for the assignment; do not use it as-is in production (use migrations).  
- Demo users only; there is no public registration.  
- Domain events are logged in-process (no message queue).  
- Team planning shows pending and approved requests, not a full calendar widget.  
- CORS is open for local development.

## Project layout

```
backend/     Node API (TypeORM, JWT, CEF handlers)
frontend/    Vue 3 UI
```
