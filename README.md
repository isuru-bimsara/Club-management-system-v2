<div align="center">
  <h1>🎓 SLIIT Events - University Club Management Platform</h1>
  <p><i>A comprehensive, modern full-stack application designed to centralize and streamline club activities, event ticketing, merchandise sales, and administrative tasks at the Sri Lanka Institute of Information Technology (SLIIT).</i></p>
  <br>
</div>

![SLIIT Events Banner](file:///C:/Users/pawan/.gemini/antigravity/brain/db43d033-f978-4c2c-8885-fab9a761a524/sliit_events_banner_1777463865275.png)

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Prerequisites](#-prerequisites)
5. [Installation & Setup](#-installation--setup)
6. [Environment Variables](#-environment-variables)
7. [API Endpoints](#-api-endpoints)
8. [Directory Structure](#-directory-structure)

---

## 🎯 Project Overview

**SLIIT Events** solves the problem of fragmented university club management. It provides a centralized, unified platform with distinct role-based access:
- **👨‍🎓 Students:** Discover clubs, view upcoming events on an interactive calendar, purchase e-tickets, and buy official club merchandise.
- **👔 Club Presidents:** Manage club profiles, organize events, sell merchandise, broadcast messages, and verify event attendees using the built-in QR scanner.
- **🛡️ Administrators:** Full system oversight, managing users, creating new clubs, assigning presidents, and generating detailed financial and attendance reports.

---

## ✨ Key Features

### 🔐 Role-Based Access Control
- **Superadmin/Admin:** Complete dashboard for system-wide metrics, user management, and report generation.
- **President:** Dedicated dashboard for managing specific club operations.
- **Student:** Intuitive interface for engagement and purchases.

### 🎪 Core Functionalities
- **User Authentication:** Secure JWT-based registration and login system.
- **Club Management:** Complete CRUD operations for clubs, including member management and rich profiles.
- **Event Management:** Comprehensive event creation with interactive calendar integration, capacity tracking, and automated status updates (upcoming/ongoing/completed).
- **Merchandise System (NEW):**
  - Presidents can list club merchandise for sale.
  - Students can place orders by uploading payment receipts.
  - Presidents review and approve/reject merchandise orders.
- **Ticketing & QR Verification:**
  - Students purchase tickets via deposit receipt uploads.
  - Approved tickets automatically generate unique **QR Codes**.
  - Presidents use the built-in **Ticket Scanner** module to verify digital e-tickets at the door.
- **Notifications & Broadcasts:** Real-time system alerts for ticket/merch updates and president-to-member broadcast messaging.
- **System Reports:** Admins can track revenue (from both tickets and merchandise) and export data seamlessly as CSV.

---

## 🛠️ Technology Stack

**Frontend:**
- ⚛️ React.js (v18)
- ⚡ Vite
- 🎨 Tailwind CSS
- 🛣️ React Router DOM
- 📝 React Hook Form + Zod (Validation)
- 📅 React Big Calendar
- 📷 React QR Reader & React QR Code

**Backend:**
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB (Mongoose)
- 🔑 JSON Web Tokens (JWT)
- 📁 Multer (File Uploads)
- 📧 Nodemailer (Email Services)

---

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v20+ recommended)
- **MongoDB** (Local instance running on default port or an Atlas URI)
- **Email Account** (For Nodemailer, e.g., Gmail with App Passwords enabled)

---

## 🚀 Installation & Setup

Getting the project up and running is incredibly simple thanks to the included batch scripts.

1. **Clone the repository** (if not already done).

2. **Automated Setup (Windows):**
   Simply run the `setup.bat` file in the root directory. This script will automatically navigate into both the `frontend` and `backend` directories and install all necessary NPM dependencies.
   ```cmd
   .\setup.bat
   ```

3. **Configure Environment Variables:**
   Make sure to create your `.env` files in both the `frontend` and `backend` directories based on the templates below.

4. **Start the Application:**
   Run the `start.bat` file. This will launch both the backend server and the frontend Vite development server in separate console windows.
   ```cmd
   .\start.bat
   ```

5. **Access the App:** Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/sliit_events
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
```

---

## 🔌 API Endpoints

The backend exposes a RESTful API with the base URL: `/api`

- **Authentication:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Administration:** `/api/admin/register`, `/api/admin/login`, `/api/admin/users`, `/api/admin/reports`
- **Clubs:** `/api/clubs` (GET, POST), `/api/clubs/:id` (GET, PUT, DELETE), `/api/clubs/:id/join`
- **Events:** `/api/events` (GET, POST), `/api/events/:id` (GET, PUT, DELETE)
- **Merchandise:** `/api/merch/president`, `/api/merch/president/orders`, `/api/merch/order`, `/api/merch/orders/me`
- **Tickets:** `/api/tickets` (POST), `/api/tickets/my-tickets`, `/api/tickets/club/:clubId`, `/api/tickets/:id/approve`
- **Notifications:** `/api/notifications`, `/api/notifications/broadcast`, `/api/notifications/read-all`

*(Note: JWT authentication is required for most endpoints based on the user's role.)*

---

## 📁 Directory Structure

```text
SLIIT-Events/
├── backend/
│   ├── config/          # Database & environment configurations
│   ├── controllers/     # Route logic & API endpoint handlers
│   ├── middleware/      # Auth, error handling, and multer uploads
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express route definitions
│   ├── uploads/         # Local file storage (dynamically created)
│   ├── utils/           # Helper functions (email, PDF gen, etc.)
│   └── server.js        # Main backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Sidebar, Navbar, etc.)
│   │   ├── context/     # React Context for global state (AuthContext)
│   │   ├── pages/       # Role-based route components (Admin, President, Student)
│   │   ├── routes/      # Application routing and Protected Routes
│   │   ├── services/    # Axios API communication services
│   │   ├── utils/       # Frontend helper and formatting functions
│   │   ├── App.jsx      # Main application wrapper
│   │   ├── index.css    # Tailwind base styles and globals
│   │   └── main.jsx     # Frontend entry point
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md            # You are here!
├── setup.bat            # Installs all dependencies automatically
└── start.bat            # Launches backend and frontend servers
```
