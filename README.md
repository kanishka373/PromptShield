# ⛨ PromptShield — Secure Prompt Gateway

A production-style full-stack web application that scans prompts, code, and text for sensitive data before it reaches AI systems.
## 💡 Why I Built This

In 2023, Samsung engineers accidentally leaked confidential source code and internal meeting notes by pasting them into ChatGPT — triggering a company-wide AI ban. As developers increasingly rely on AI tools for daily work, the risk of accidentally leaking API keys, passwords, and credentials into a prompt is very real.
<img width="1917" height="903" alt="Screenshot 2026-08-25 171906" src="https://github.com/user-attachments/assets/cec22263-1b62-4631-a79f-6f625be5ed7a" />
<img width="1897" height="732" alt="Screenshot 2026-08-25 172026" src="https://github.com/user-attachments/assets/efd79dc6-2f26-4409-bf7b-c72d2ec356ab" />
<img width="1893" height="811" alt="Screenshot 2026-08-25 172122" src="https://github.com/user-attachments/assets/497e3f75-a175-400f-9bd7-b01e7d09ab38" />



**PromptShield sits between your code and any AI tool** — scanning and masking sensitive data before it ever leaves your machine, so you can use AI freely without putting yourself or your company at risk.



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

Edit `.env` and replace the MongoDB URI with your Atlas connection string:

```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/promptshield
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:5000`

## 🔐 Detection Engine

Detects: API Keys, Passwords, JWT Tokens, Emails, Phone Numbers, MongoDB URIs, AWS Keys — using a custom regex-based detection engine covering 20+ secret formats.

## 📊 Risk Scoring

| Secret Type  | Score |
|--------------|-------|
| JWT Token    | 50    |
| MongoDB URI  | 50    |
| AWS Key      | 50    |
| API Key      | 40    |
| Password     | 30    |
| Email        | 10    |
| Phone        | 10    |

- **0–30** → Low Risk
- **31–70** → Medium Risk
- **71+** → High Risk

## 📄 Features

- ✅ Landing page with animated particle-network background
- ✅ Live detection demo — try it without signing up
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

## 🔗 Live Demo

_Coming soon_

## 👩‍💻 About

Built by Kanishka — for placement interviews & viva demos.
