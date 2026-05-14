# SaleCore Backend API - Enterprise Edition

A high-performance, industry-standard backend built with NestJS for agent tracking, attendance management, and secure authentication.

## 🚀 Key Features

### 1. Advanced Agent Tracking
- **Real-time Tracking**: Integrated with **Socket.io** (Namespace: `/tracking`) for live map updates (Zomato/Swiggy style).
- **Offline Sync (Bulk Mode)**: Dedicated `/attendance/bulk-track` API to sync historical tracking data after network restoration.
- **Intelligent Activity Analysis**: Automatically detects "Site Visits" (Stay Time) based on a **2km radius** rule.
- **Distance Calculation**: Accurate travel distance tracking using the **Haversine Formula**.
- **Real Geocoding**: Integrated with **OpenStreetMap (Nominatim)** to automatically convert GPS coordinates into full street addresses.

### 2. Attendance & Analytics
- **Punch-In / Punch-Out**: Dedicated module for recording agent attendance with live location capture.
- **Real-time Daily Stats**: `/attendance/today-stats` endpoint returns total distance traveled, total stops, and punch-in time for the current day.
- **High Performance Caching**: Integrated **@nestjs/cache-manager** to serve daily stats and frequent requests in milliseconds.

### 3. Secure Authentication
- **JWT Based Auth**: Secure session management with 7-day default persistence.
- **OTP Recovery**: Password recovery via email using SMTP with 6-digit OTP validation.
- **Input Validation**: Strict request validation using `class-validator`.

### 4. Professional Infrastructure
- **Modular Architecture**: Isolated `Auth` and `Attendance` modules for maximum scalability.
- **Security**: Integrated with **Helmet** for secure HTTP headers and full **CORS** support.
- **CI/CD Pipeline**: GitHub Actions setup for automated builds and validation.
- **Interactive API Docs**: Full Swagger UI documentation with Bearer Auth support.

---

## 🛠️ Technology Stack
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
- **Real-time**: [Socket.io](https://socket.io/)
- **Caching**: [Cache-Manager](https://github.com/node-cache-manager/node-cache-manager)
- **Security**: Passport.js (JWT), Bcrypt, Helmet
- **Mailing**: Nodemailer (SMTP)
- **API Communication**: Axios (for Reverse Geocoding)
- **Documentation**: Swagger UI (OpenAPI 3.0)

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
