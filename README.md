# HRMS Lite – Full Stack Web Application

## 🚀 Live Application
🔗 https://hrms-lite-kar2.onrender.com

## 📂 GitHub Repository
🔗 https://github.com/aayushteotia/hrms-lite

---

## 📖 Project Overview

HRMS Lite is a lightweight Human Resource Management System designed to manage employee records and track daily attendance.

This project demonstrates end-to-end full-stack development including:

- Frontend development
- Backend API design
- Database modeling
- Server-side validation
- Error handling
- Production deployment

The application simulates a basic internal HR tool with a clean, professional interface.

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI Components
- React Query

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL (Neon Cloud Database)
- Drizzle ORM

### Deployment
- Render (Full-stack hosting)
- Neon (Cloud PostgreSQL)

---

## ✨ Features

### Employee Management
- Add new employee
- Unique Employee ID validation
- Email format validation
- Prevent duplicate records
- View all employees
- Delete employee

### Attendance Management
- Mark attendance (Present / Absent)
- View attendance per employee
- Persistent storage in PostgreSQL

### Dashboard
- Total employee count
- Present today count
- Professional UI layout

### System Quality
- RESTful APIs
- Proper HTTP status codes
- Graceful error handling
- Production-ready build setup

---

## 📦 API Endpoints

### Employees
- `GET /api/employees`
- `POST /api/employees`
- `DELETE /api/employees/:id`

### Attendance
- `GET /api/employees/:id/attendance`
- `POST /api/attendance`

### Stats
- `GET /api/stats`

---

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/aayushteotia/hrms-lite.git
cd hrms-lite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```
DATABASE_URL=<your_neon_database_url>
PORT=5000
```

### 4. Push Database Schema

```bash
npx drizzle-kit push
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
