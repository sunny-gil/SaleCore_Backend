# SaleCore Backend API - Enterprise Edition

A high-performance, industry-standard backend built with NestJS for agent tracking, attendance management, and secure authentication.

## 🚀 Key Features

### 1. Advanced Agent Tracking
- **Real-time Tracking**: Integrated with **Socket.io** for live map updates (Zomato/Swiggy style).
- **Offline Mode**: Support for bulk syncing tracking data when agents return to network areas.
- **Intelligent Activity Analysis**: Automatically detects "Site Visits" (Stay Time) based on a **2km radius**.
- **Distance Calculation**: Accurate travel distance tracking using the **Haversine Formula**.

### 2. Attendance Management
- **Punch-In / Punch-Out**: Dedicated module for recording agent attendance with live location capture.
- **Daily Stats**: Real-time calculation of total distance traveled and total stops per day.

### 3. Secure Authentication
- **JWT Based Auth**: Secure session management with a 7-day default persistence.
- **OTP Recovery**: Password recovery via email using SMTP with 6-digit OTP validation.
- **Input Validation**: Strict request validation using `class-validator` (Password complexity, mobile regex, etc.).

### 4. Professional Infrastructure
- **Modular Architecture**: Clean separation between `Auth`, `Attendance`, and `Common` modules.
- **Caching**: Global API caching for optimized performance.
- **Security**: Integrated with **Helmet** for secure HTTP headers and full **CORS** support.
- **Swagger Documentation**: Fully interactive API documentation with Bearer Auth support.

---

## 🛠️ Technology Stack
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Real-time**: [Socket.io](https://socket.io/)
- **Security**: Passport.js (JWT), Bcrypt, Helmet
- **Mailing**: Nodemailer (SMTP)
- **Documentation**: Swagger UI (OpenAPI 3.0)

---

## 📂 Project Structure
```text
src/
├── app/
│   ├── auth/          # Authentication, Registration, OTP
│   └── attendance/    # Tracking, Punch-In/Out, Stay-time Logic
├── common/            # Global Interceptors (Response Formatting)
├── main.ts            # Entry Point
└── app.module.ts      # Root Module Coordinator
```

---

## 🚦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
email=your_smtp_email
password=your_smtp_password
JWT_SECRET=your_jwt_secret
```

### 3. Running the App
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### 4. API Documentation
Once running, visit:
`http://localhost:5000/api/docs`

---

### Created and Maintained by **Sunny**
