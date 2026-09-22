# 🛡️ PromptShield — Secure Prompt Gateway

PromptShield is a full-stack security tool that scans your code, configs, and text for sensitive secrets — API keys, passwords, tokens, database credentials, and more — before you paste them into ChatGPT, Claude, or any other AI tool. It automatically masks detected secrets with safe placeholders so your prompt stays useful without leaking anything sensitive.

## 🚨 Why I Built This

In 2023, Samsung engineers accidentally leaked confidential source code and internal meeting notes by pasting them into ChatGPT, triggering a company-wide AI ban. PromptShield was built to prevent exactly this kind of accidental leak — giving developers a safety layer between their code and any AI tool.

---

## ✨ Features

### Core Detection Engine
- **8 secret categories detected**: API Keys (OpenAI, GitHub, Slack, Stripe, SendGrid, npm, Google, Razorpay), Private Keys (RSA/EC/DSA/OpenSSH), Passwords, JWT Tokens, Database URIs (MongoDB/PostgreSQL/MySQL/Redis), AWS Keys, Emails, and Phone Numbers
- **Instant masking** — every detected secret is replaced with a readable placeholder (e.g. `[API_KEY_MASKED]`) so the text stays usable
- **Weighted risk scoring** — every scan gets a 0–100 risk score and a Low/Medium/High verdict based on the severity of what's found
- **Overlap-prevention logic** — priority-based detection ensures the same text is never double-counted across categories (e.g. a MongoDB URI won't also get flagged as a stray email)
- **Context-aware detection** — phone numbers and certain passwords require a labeling keyword (`phone:`, `password:`, etc.) to reduce false positives; email detection excludes patterns embedded inside URLs (like Sentry DSNs)

### App Features
- **Bulk file upload** — scan entire files (`.env`, `.js`, `.json`, `.py`, `.yml`, `.txt`, etc.) instead of pasting text manually
- **Scan history** — every saved scan is archived with its findings; revisit any scan to compare original vs. masked output, with a one-click copy for the safe (masked) text
- **PDF & CSV reports** — export a branded PDF report or dump your full scan history to CSV for audits
- **Safe Days Counter** — a Dashboard widget tracking how many days it's been since your last high-risk scan
- **Live landing-page demo** — try the detection engine with zero signup, entirely client-side, before creating an account

### Security & Reliability
- **Helmet.js** — sets industry-standard HTTP security headers (clickjacking protection, MIME-sniffing prevention, hidden tech stack, etc.)
- **Rate limiting** — the scan endpoint is capped at 20 requests/minute per IP to prevent abuse
- **JWT-based authentication** — all saved scans are private to the logged-in user
- **Extensively tested detection engine** — validated against 10+ real-world scenarios (payment gateways, Django/env configs, Slack/npm tokens, clean/safe code with zero false positives, edge cases like URL-embedded patterns)

---

## 🖥️ Tech Stack

**Frontend:** React, Vite, Framer Motion, Recharts, Monaco Editor, Lucide Icons, TailwindCSS
**Backend:** Node.js, Express, MongoDB Atlas (Mongoose)
**Security:** Helmet, express-rate-limit, JWT, bcrypt
**Detection:** Custom regex-based engine with priority-ordered overlap prevention

---

## 📸 Core Pages

| Page | Description |
|---|---|
| **Landing** | Public marketing page with a live, client-side detection demo |
| **Login / Signup** | JWT-authenticated access |
| **Dashboard** | Overview stats, weekly activity chart, risk distribution, Safe Days counter, recent scans |
| **Scanner** | Paste or upload text/files, scan, mask, and copy the safe output |
| **History** | Full scan archive with filtering by month, view/delete individual scans |
| **Reports** | Export PDF/CSV reports, detection breakdown chart, weekly trend |
| **Settings** | Profile management, password change, data export, account deletion |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (free tier works) — [create one here](https://www.mongodb.com/cloud/atlas/register)

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/PromptShield.git
cd PromptShield
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend` with:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔍 What It Detects

| Category | Examples |
|---|---|
| API Keys | OpenAI (`sk-proj-...`), GitHub (`ghp_...`), Slack (`xoxb-...`, `xoxp-...`), Stripe (`sk_live_...`), SendGrid, npm, Google (`AIza...`), Razorpay (`rzp_live_...`) |
| Private Keys | RSA / EC / DSA / OpenSSH PEM blocks |
| Passwords | Labeled password/secret assignments (`password:`, `client_secret:`, etc.) |
| JWT Tokens | Any valid `eyJ...` structured token |
| Database URIs | MongoDB, PostgreSQL, MySQL, Redis connection strings |
| AWS Keys | Access Key IDs (`AKIA...`, `ASIA...`) |
| Emails | Standard email addresses (excludes URL-embedded false positives) |
| Phone Numbers | Labeled numbers only (`phone:`, `mobile:`, `contact:`, etc.) |

> ⚠️ **Note:** This is a regex-based detection engine and, like any pattern-based scanner (including tools such as GitHub Secret Scanning), it may occasionally miss highly custom or non-standard secret formats. Always double-check masked output before sending sensitive data anywhere.

---

## 🔐 Data Privacy

- The landing-page demo runs **100% client-side** — nothing is sent to a server unless you're logged in and explicitly save a scan.
- Saved scans are stored under your JWT-protected account and are never visible to other users.
- You can delete your account and all associated data at any time from Settings.

---
## 🏗️ Architecture

```mermaid
flowchart TD

subgraph group_client["Client Application"]
  node_app_routes["App Routes<br/>[AppRoutes.jsx]"]
  node_landing["Landing Demo<br/>[Landing.jsx]"]
  node_auth_shield["Auth Shield<br/>[AuthShield.jsx]"]
  node_auth_context["Auth Context<br/>[AuthContext.jsx]"]
  node_scanner["Scanner<br/>[Scanner.jsx]"]
  node_dashboard["Dashboard<br/>[Dashboard.jsx]"]
  node_history["History<br/>[History.jsx]"]
  node_reports["Reports<br/>[Reports.jsx]"]
  node_settings["Settings<br/>[Settings.jsx]"]
  node_api_client["API Client<br/>[api.js]"]
end

subgraph group_api["API Security"]
  node_server["Express Server<br/>[server.js]"]
  node_auth_routes["Auth Routes<br/>[authRoutes.js]"]
  node_scan_routes["Scan Routes<br/>[scanRoutes.js]"]
  node_auth_controller["Auth Controller<br/>[authController.js]"]
  node_scan_controller["Scan Controller<br/>[scanController.js]"]
  node_auth_middleware["JWT Middleware<br/>[authMiddleware.js]"]
end

subgraph group_engine["Scan Engine"]
  node_secret_detector["Secret Detector<br/>[secretDetector.js]"]
  node_masking_engine["Masking Engine<br/>[maskingEngine.js]"]
  node_risk_calculator["Risk Calculator<br/>[riskCalculator.js]"]
end

subgraph group_data["Persistence"]
  node_user_model["User Model<br/>[User.js]"]
  node_scan_model["Scan Store<br/>[Scan.js]"]
  node_mongodb[("MongoDB")]
end

node_user(("User"))
node_scan_result["Masked Scan Result"]

node_user -->|"opens app"| node_app_routes
node_app_routes -->|"routes public"| node_landing
node_app_routes -->|"routes auth"| node_auth_shield
node_app_routes -->|"protects scanner"| node_scanner
node_app_routes -->|"protects dashboard"| node_dashboard
node_app_routes -->|"protects history"| node_history
node_app_routes -->|"protects reports"| node_reports
node_app_routes -->|"protects settings"| node_settings
node_auth_shield -->|"submits credentials"| node_api_client
node_auth_shield -->|"stores session"| node_auth_context
node_scanner -->|"submits text"| node_api_client
node_dashboard -->|"loads summaries"| node_api_client
node_history -->|"loads history"| node_api_client
node_reports -.->|"requests reports"| node_api_client
node_settings -->|"manages account"| node_api_client
node_api_client -->|"calls API"| node_server
node_server -->|"dispatches auth"| node_auth_routes
node_server -->|"dispatches scans"| node_scan_routes
node_auth_routes -->|"invokes auth"| node_auth_controller
node_scan_routes -->|"invokes scans"| node_scan_controller
node_auth_routes -->|"protects routes"| node_auth_middleware
node_scan_routes -->|"protects routes"| node_auth_middleware
node_auth_controller -->|"reads writes users"| node_user_model
node_auth_controller -->|"manages user scans"| node_scan_model
node_auth_middleware -->|"loads user"| node_user_model
node_scan_controller -->|"detects secrets"| node_secret_detector
node_scan_controller -->|"masks matches"| node_masking_engine
node_scan_controller -->|"calculates risk"| node_risk_calculator
node_scan_controller -->|"saves reads scans"| node_scan_model
node_scan_controller -->|"returns result"| node_scan_result
node_scan_model -->|"persists scans"| node_mongodb
node_user_model -->|"persists users"| node_mongodb

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
class node_app_routes,node_landing,node_auth_shield,node_auth_context,node_scanner,node_dashboard,node_history,node_reports,node_settings,node_api_client,node_user toneBlue
class node_server,node_auth_routes,node_scan_routes,node_auth_controller,node_scan_controller,node_auth_middleware toneAmber
class node_secret_detector,node_masking_engine,node_risk_calculator toneMint
class node_user_model,node_scan_model,node_mongodb toneRose
class node_scan_result toneIndigo
```
## 🚀 Future Improvements

- Browser extension for real-time scanning inside ChatGPT/Claude's input box
- Entropy-based detection to catch high-randomness secrets that don't match a known pattern
- Shareable, secrets-free scan summary links
- Per-secret severity badges (Critical/High/Medium)

---

## 👩‍💻 Built By

**Kanishka** — Final-year Computer Science Engineering student, Rayat Bahra University, Chandigarh