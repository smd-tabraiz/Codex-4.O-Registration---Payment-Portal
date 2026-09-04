# Codex 4.0 — Team Event Registration Portal

Full-stack MERN application for **Codex 4.0** (Overnight 8-Hour Technical Coding Event), organized by **Coders' Club, GPREC**.

---

## 🌟 Key Features

- **Team Registration System:** 2 to 3 members per team. Member 1 acts as primary Team Leader.
- **Strict 4th-Year Student Constraint:** Server-enforced rule permitting **0 or at most 1** 4th-year student per team (2 or 3 4th-year members strictly rejected).
- **Roll Number Uniqueness:** Database-backed duplicate check prevents registered students from re-registering across teams.
- **Cashfree Payment Gateway:** Official Cashfree PG API v2023-08-01 with Web Checkout SDK v3 modal integration and Webhook verification.
- **Email Automation:** Nodemailer HTML email notifications with Team ID (`CDX4-XXXX`), date/time (24th Sept, 9:00 AM – 5:00 PM), venue, and member breakdown.
- **On-Demand Excel Export:** Generated directly from MongoDB Atlas using `exceljs` via protected admin route `GET /api/admin/export`.
- **Pending Registration TTL:** Holds slots for 10 minutes during checkout before releasing roll numbers if unpaid.
- **Admin Dashboard:** Password/Secret protected portal with live statistics, search/filter capabilities, email resend actions, and manual status updates.

---

## 📁 Directory Structure

```
CC - REG-PAY/
├── client/                 # React (Vite) + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/     # Navbar, Hero, Rules, Form, SuccessModal, AdminDashboard, FAQ
│   │   ├── api/            # Axios API Client
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── server/                 # Express + MongoDB Backend
│   ├── models/             # Registration, Counter, User
│   ├── controllers/        # Register, Webhook, Admin Controllers
│   ├── routes/             # API routes
│   ├── utils/              # Cashfree, SendGrid Mailer, Google Sheets, ExcelJS helper
│   ├── middleware/         # AdminAuth, RateLimiter
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 🚀 Running locally

### 1. Backend Setup
```bash
cd server
npm install
# Create .env file or copy .env.example
npm run dev
```
Runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`.

---

## 🔐 Environment Variables (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codex40
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=SANDBOX
CASHFREE_API_VERSION=2023-08-01
ADMIN_SECRET=admin12345
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM_ADDRESS=codersclub@gprec.ac.in
EVENT_FEE_PER_TEAM=300
REGISTRATION_CAP=50
```
