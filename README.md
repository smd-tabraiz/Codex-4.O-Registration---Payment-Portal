# Codex 4.0 — Team Event Registration Portal

Full-stack MERN application for **Codex 4.0** (Overnight 8-Hour Technical Coding Event), organized by **Coders' Club, GPREC**.

---

## 🌟 Key Features

- **Team Registration System:** 2 to 3 members per team. Member 1 acts as primary Team Leader.
- **Strict 4th-Year Student Constraint:** Server-enforced rule permitting **0 or at most 1** 4th-year student per team (2 or 3 4th-year members strictly rejected).
- **Roll Number Uniqueness:** Database-backed duplicate check prevents registered students from re-registering across teams.
- **Razorpay Payment Gateway:** Server-side HMAC SHA256 signature verification and Razorpay Webhook fallback handler.
- **Email Automation:** Nodemailer HTML email notifications with Team ID (`CDX4-XXXX`), date/time (24th Aug, 9:00 PM – 5:00 AM), venue, and member breakdown.
- **On-Demand Excel Export:** Generated directly from MongoDB Atlas using `exceljs` via protected admin route `GET /api/admin/export`.
- **Pending Registration TTL:** Holds slots for 15 minutes during checkout before releasing roll numbers if unpaid.
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
│   ├── models/             # Registration, Counter
│   ├── controllers/        # Register, Webhook, Admin Controllers
│   ├── routes/             # API routes
│   ├── utils/              # Razorpay, Nodemailer, ExcelJS helper
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
Runs on `http://localhost:3000`.

---

## 🔐 Environment Variables (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codex40
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
ADMIN_SECRET=admin12345
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Coders' Club GPREC <your_email@gmail.com>"
EVENT_FEE_PER_TEAM=150
REGISTRATION_CAP=50
```
