# ⛨ PromptShield — Secure Prompt Gateway

A production-style full-stack web application that scans prompts, code, and text for sensitive data before it reaches AI systems.

## 🚀 Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + Framer Motion + Monaco Editor + Recharts + jsPDF
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Atlas)
- **Auth:** JWT + bcrypt

## 📁 Project Structure
```
PromptShield/
├── frontend/     → React app (Vite)
└── backend/      → Express API
```

## ⚙️ Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```

Edit `.env` and replace MongoDB URI with your Atlas connection string:
```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/promptshield
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173  
Backend runs on: http://localhost:5000

## 🔐 Detection Engine
Detects: API Keys, Passwords, JWT Tokens, Emails, Phone Numbers, MongoDB URIs, AWS Keys

## 📊 Risk Scoring
| Secret Type | Score |
|-------------|-------|
| JWT Token   | 50    |
| MongoDB URI | 50    |
| AWS Key     | 50    |
| API Key     | 40    |
| Password    | 30    |
| Email       | 10    |
| Phone       | 10    |

- 0–30 → Low Risk
- 31–70 → Medium Risk  
- 71+ → High Risk

## 📄 Features
- ✅ Landing page with animated particles
- ✅ JWT Authentication (Register/Login)
- ✅ Monaco Editor-based Scanner
- ✅ Real-time secret detection (regex engine)
- ✅ Auto-masking engine
- ✅ Risk score calculator
- ✅ Dashboard with charts (Recharts)
- ✅ Scan History with View/Delete
- ✅ PDF Report download (jsPDF)
- ✅ CSV Export
- ✅ Dark neon theme with glassmorphism

## 👩‍💻 Built for placement interviews & viva demos
