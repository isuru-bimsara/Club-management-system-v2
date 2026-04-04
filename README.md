# SLIIT Events - University Club Management Platform

A comprehensive, full-stack MERN application designed to centralize and manage all student club activities, event ticketing, and administrative tasks at the Sri Lanka Institute of Information Technology (SLIIT).

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Directory Structure](#directory-structure)
8. [API Documentation](#api-documentation)

---

## Project Overview

SLIIT Events solves the problem of fragmented university club management. It provides a single platform where:
- **Students** can discover clubs, view event calendars, and purchase e-tickets.
- **Club Presidents** can manage their club's profile, create events, broadcast messages to members, and verify tickets.
- **Administrators** have oversight of the entire system, managing users, creating clubs, assigning presidents, and generating financial and attendance reports.

## Features

### Role-Based Access Control
- **Admin/Superadmin:** Full system oversight.
- **President:** Club-specific management.
- **Student:** Browsing, joining clubs, and purchasing tickets.

### Core Functionalities
- **User Authentication:** Secure JWT-based registration and login.
- **Club Management:** Complete CRUD, image uploads, member management.
- **Event Management:** Calendar integration, capacity tracking, status automation (upcoming/ongoing/completed).
- **Ticketing System:** Students purchase tickets by uploading deposit receipts. Presidents review and approve them.
- **E-Tickets & QR Codes:** Approved tickets generate unique QR codes for entrance verification.
- **Ticket Scanner:** Built-in scanner for event entrance verification.
- **Notifications & Broadcasts:** System alerts for ticket updates, and president-to-member broadcast capabilities.
- **System Reports:** Admins can export attendance and revenue data as CSV.

## Technology Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Multer, Nodemailer.
- **Frontend:** React.js, Vite, Tailwind CSS, React Router, React Hook Form, Zod, React Big Calendar, Axios.

## Prerequisites

- Node.js (v20+ recommended)
- MongoDB (Local instance or MongoDB Atlas)
- Email account for Nodemailer (e.g., Gmail with App Passwords enabled)

## Installation & Setup

1. **Clone the repository:**
   (Not applicable here as the code is pre-generated in your directory)

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory (refer to [Environment Variables](#environment-variables)).
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory.
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## Environment Variables

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

## Directory Structure

```text
SLIIT-Events/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic mapped to API endpoints
│   ├── middleware/      # Auth, error, and upload middlewares
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── uploads/         # Local file storage (created dynamically)
│   ├── utils/           # Helper functions (email, QR auth, etc.)
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/          
    ├── src/
    │   ├── components/  # Reusable UI elements and feature components
    │   ├── context/     # React Context for global state (Auth)
    │   ├── hooks/       # Custom React hooks
    │   ├── pages/       # Route components organized by role
    │   ├── routes/      # Application routing logic (Protected Routes)
    │   ├── services/    # Axios API communication layer
    │   ├── utils/       # Frontend helper functions
    │   ├── App.jsx      # Main application component
    │   ├── index.css    # Tailwind base styles
    │   └── main.jsx     # Frontend entry point
    └── tailwind.config.js
```

## API Documentation

The backend exposes a RESTful API. Base URL: `/api`

- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Admin:** `/api/admin/register`, `/api/admin/login`, `/api/admin/users`, `/api/admin/reports`
- **Clubs:** `/api/clubs` (GET, POST), `/api/clubs/:id` (GET, PUT, DELETE), `/api/clubs/:id/join`
- **Events:** `/api/events` (GET, POST), `/api/events/:id` (GET, PUT, DELETE)
- **Tickets:** `/api/tickets` (POST), `/api/tickets/my-tickets`, `/api/tickets/club/:clubId`, `/api/tickets/:id/approve`
- **Notifications:** `/api/notifications`, `/api/notifications/broadcast`, `/api/notifications/read-all`

*(Authentication required for most endpoints based on role)*
