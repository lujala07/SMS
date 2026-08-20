# Role-Based Student Academic Management System

PERN stack academic MVP for a role-based Student Management System. The app supports admin setup, teacher attendance and assignment workflows, and student dashboard/submission views.

## Stack

- PostgreSQL
- Express + TypeScript
- React + Vite + TypeScript
- JWT authentication
- Filesystem uploads for assignment submissions

## Local Setup

1. Create a PostgreSQL database, for example `sms_db`.
2. Copy `server/.env.example` to `server/.env` and fill the values.
3. Install dependencies:

```bash
cd server
npm install
cd ../client
npm install
```

4. Create tables and seed demo data:

```bash
cd server
npm run db:schema
npm run db:seed
```

5. Start both apps:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Default URLs:

- Client: `http://localhost:5173`
- API: `http://localhost:5000`

## Environment

Server variables:

- `PORT=5000`
- `CORS_ORIGIN=http://localhost:5173`
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_NAME=sms_db`
- `DB_USER=postgres`
- `DB_PASSWORD=your_password`
- `JWT_SECRET=replace_with_a_strong_secret`

Client variable:

- `VITE_API_URL=http://localhost:5000`

## Demo Accounts

All seeded accounts use password `Password@123`.

- Admin: `admin@sms.local`
- Teacher: `teacher@sms.local`
- Student: `student@sms.local`

## Feature Matrix

- Admin: dashboard, users, students, teachers, departments, classes, subjects, teacher-subject assignments, notices, reports.
- Teacher: dashboard, assigned subjects, attendance, assignments, submission review, notices, reports.
- Student: dashboard, attendance, assignments, PDF submission, marks, feedback, notices.

## Verification

```bash
cd server
npm run type-check
npm run build
```

```bash
cd client
npm run lint
npm run build
```

## Demo Flow

1. Login as admin and confirm departments, teachers, students, classes, subjects, notices, and reports load.
2. Create or edit a teacher and department from the admin pages.
3. Login as teacher and mark attendance for an assigned subject.
4. Create an assignment and review a student submission.
5. Login as student and view dashboard, attendance, assignments, marks, and feedback.

## Notes

- Uploaded submissions are stored under `server/uploads/` and ignored by Git.
- The MVP intentionally excludes exams/results, fees, timetables, guardians, and hosted production deployment.
- Deletes preserve academic history. Records with dependent academic data return a conflict instead of cascading deletion.
