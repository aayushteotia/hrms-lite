# HRMS Lite

A lightweight Human Resource Management System built with React, Node.js, and PostgreSQL.

## Features

- **Employee Management**: Add, View, Update, and Delete employee records.
- **Attendance Tracking**: Mark attendance (Present/Absent/Leave) and view history.
- **Dashboard**: Real-time overview of total employees and daily attendance.
- **Responsive Design**: Modern UI with sidebar navigation and mobile support.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI, Recharts, Framer Motion
- **Backend**: Node.js (Express), Drizzle ORM
- **Database**: PostgreSQL

## Setup Instructions

1. **Clone the repository** (if not already on Replit).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Database Setup**:
   - Ensure you have a PostgreSQL database provisioned.
   - The `DATABASE_URL` environment variable must be set.
   - Push the schema:
     ```bash
     npm run db:push
     ```
4. **Run the application**:
   ```bash
   npm run dev
   ```
   The application will start on port 5000.

## API Documentation

- `GET /api/employees`: List all employees
- `POST /api/employees`: Create new employee
- `POST /api/attendance`: Mark attendance
- `GET /api/stats`: Dashboard statistics

## License

MIT
