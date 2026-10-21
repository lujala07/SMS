# Student Management System

A web-based Student Management System developed for managing academic records, attendance, assignments, submissions, notices, and basic reports.

The system provides separate dashboards and permissions for Admin, Teacher, and Student users.

## Features

### Admin
- Manage users, students, teachers, departments, classes, and subjects
- Assign teachers to subjects
- Manage notices
- View academic reports
- Create additional admin accounts

### Teacher
- View assigned subjects
- Mark student attendance
- Create and manage assignments
- Review student submissions
- Give marks and feedback
- Create notices for admin approval
- View reports

### Student
- View attendance records
- View assignments
- Submit written responses or PDF files
- View marks and teacher feedback
- View published notices

### Other Features
- Role-based authentication and authorization
- Search, sorting, filtering, and pagination
- Automatic student code generation
- PDF assignment submissions
- Email invitations for student and teacher accounts
- Live notifications using Socket.IO
- Responsive sidebar and mobile navigation

## Technologies Used

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express
- TypeScript
- Socket.IO

**Database**
- PostgreSQL

**Authentication**
- JWT
- bcrypt

**Other Tools**
- Multer for file uploads
- Nodemailer for account invitations
- Git and GitHub
- Postman

## Project Structure

```text
SMS/
├── client/          # React frontend
├── server/          # Node.js and Express backend
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
└── README.md
```

## Local Setup

### 1. Requirements

Make sure you have:

- Node.js
- npm
- PostgreSQL

### 2. Install Dependencies

From the project root:

```bash
npm --prefix server install
npm --prefix client install
```

### 3. Configure Environment

Copy:

```text
server/.env.example
```

to:

```text
server/.env
```

Then configure your PostgreSQL connection and JWT secret.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sms_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

SMTP configuration is only required when creating new Student or Teacher accounts through email invitations.

### 4. Create the Database

```bash
createdb -U postgres sms_db

psql -U postgres -d sms_db -f database/schema.sql

psql -U postgres -d sms_db -f database/seed.sql
```

### 5. Run the Application

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo Accounts

All seeded accounts use:

```text
Password@123
```

| Role | Email |
| --- | --- |
| Admin | admin@sms.local |
| Teacher | teacher@sms.local |
| Student | student@sms.local |

## Main Workflow

### Account Management

The Admin creates and manages academic records and user accounts.

Student and Teacher accounts can receive an email invitation to create their password.

### Attendance

Teachers select an assigned subject and date, then mark students as Present, Absent, or Late.

Students can view their attendance history.

### Assignments and Submissions

Teachers create assignments for assigned subjects.

Students can submit:
- written responses
- PDF files
- or both

Teachers can review submissions and provide marks and feedback.

### Notices

Admins can publish notices directly.

Teacher notices require Admin approval before publication.

### Notifications

The application supports notification history, unread counts, and live notifications using Socket.IO.

Notifications are generated for events such as:
- new assignments
- new submissions
- reviewed submissions
- notice approvals
- published notices

## Development Commands

Backend:

```bash
npm run dev
npm run type-check
npm run build
```

Frontend:

```bash
npm run dev
npm run lint
npm run build
```

## Project Scope

The system currently covers:

- User and academic record management
- Attendance
- Assignments and submissions
- Notices
- Notifications
- Basic reports

The following are outside the current scope:

- Fee management
- Examination and result processing
- Timetables
- Guardian accounts
- Production deployment
