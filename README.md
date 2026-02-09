# HRMS Lite

A full-stack Human Resource Management System built using React, Node.js, and PostgreSQL.  
This application allows organizations to manage employee records, track attendance, and monitor real-time HR statistics through a responsive dashboard interface.

---

## Features

- Employee Management (Create, Read, Update, Delete)
- Attendance Tracking (Present / Absent / Leave)
- Real-time Dashboard Statistics
- Responsive User Interface
- RESTful API Architecture

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Shadcn UI
- Recharts
- Framer Motion

### Backend
- Node.js
- Express.js
- Drizzle ORM

### Database
- PostgreSQL

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd hrms-lite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

### 4. Push Database Schema

```bash
npm run db:push
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will run at:

```
http://localhost:5000
```

---

## API Endpoints

### Employee Routes

```bash
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Attendance Routes

```bash
POST   /api/attendance
GET    /api/attendance
```

### Dashboard Route

```bash
GET /api/stats
```

---

## Project Structure

```
client/   → Frontend (React)
server/   → Backend (Express API & database logic)
shared/   → Shared schemas and types
```

---

## Future Improvements

- JWT Authentication
- Role-Based Access Control (Admin / HR / Employee)
- Leave Management System
- Payroll Integration
- Cloud Deployment

---

## License

This project is licensed under the MIT License.
