# RecruitCred — Campus Recruitment Credibility Platform

> **“Build Credibility. Get Recruited With Confidence.”**

RecruitCred is a transparent skill-verification and campus recruitment credibility platform connecting **Students**, **University Placement Cells**, and **Recruiters**. It replaces unverifiable resume buzzwords with standardized, proctored assessments, authentic code repository evidence, and cryptographic verification badges (`RC-V...`).

---

## 📑 Table of Contents
1. [Product Overview](#1-product-overview)
2. [Core Features](#2-core-features)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Setup Instructions](#5-setup-instructions)
6. [Environment Variables](#6-environment-variables)
7. [How Authentication Works](#7-how-authentication-works)
8. [How Assessments Work](#8-how-assessments-work)
9. [How Verification Works](#9-how-verification-works)
10. [How CredAI Works](#10-how-credai-works)
11. [Security Considerations](#11-security-considerations)
12. [Demo Credentials & Evaluation Personas](#12-demo-credentials--evaluation-personas)

---

## 1. Product Overview
In traditional campus hiring, 78% of student resumes contain self-declared skills that recruiters cannot easily verify upfront. This creates screening fatigue, wasted technical round hours, and placement cell blindspots.

RecruitCred introduces an evidence-backed credibility layer:
$$\text{Claim} \longrightarrow \text{Evidence} \longrightarrow \text{Assessment} \longrightarrow \text{Verification} \longrightarrow \text{Recruiter Confidence}$$

Students validate their technical ability through objective, timed evaluations and code repositories. Recruiters filter candidates by verified competencies, and placement cells gain real-time cohort readiness analytics.

---

## 2. Core Features

- **Professional Post-Login Dashboard**: Reorganized, high-density, serious recruitment-tech UI (Linear + LinkedIn + career analytics aesthetic) replacing gaming/gamified dashboards.
- **Top Credibility Summary & Identity**:
  - Direct student profile header with verified photo upload, academic credentials, and browser auto-location detection.
  - Compact credibility KPI overview: Credibility Score (`84/100`), Verified Skills (`7`), Assessments (`5`), Evidence (`12`), Profile Placement Strength (`91%`).
- **Multi-Disciplinary Skill Development Ecosystem**:
  - Comprehensive skill cards spanning Programming (`C`, `C++`, `Java`, `Python`, `TypeScript`), Web Development (`React`, `Next.js`, `HTML/CSS`), Data & AI (`SQL`, `Pandas`, `NumPy`, `Machine Learning`, `Computer Vision`, `OpenCV`), Mechanical / CAD (`AutoCAD`, `SolidWorks`, `Fusion 360`, `CATIA`, `3D Modeling`), Electronics & Embedded (`Arduino`, `ESP32`, `Embedded C`, `PCB Design`), and Career Skills (`Problem Solving`, `Technical Communication`, `Project Management`).
  - Strict 4-tier status lifecycle: `CLAIMED` ➔ `EVIDENCE-BACKED` ➔ `ASSESSED` ➔ `VERIFIED`.
- **Searchable Skill Library Modal**: 10-category engineering dropdown with instant search, keyboard navigation, duplicate prevention, and clean default `Claimed` classification.
- **Personalized Company Requirements & Detailed Modals**:
  - Direct visibility into employer expectations (`AutoWorks`, `DemoTech`, `DataCore`, `InnovateAI`, `Tata Motors`) displaying minimum assessment cutoffs, required certificates, and real-time candidate eligibility (`Eligible`, `Likely Eligible`, `Assessment Required`).
- **Official Digital Credentials & PDF Generation**:
  - Automated certificate generation upon scoring $\ge 70\%$ on proctored technical evaluations.
  - Dynamic student name, unique credential ID (e.g. `RC-PY-2026-001482`), date, score, tamper-proof QR verification link, and print/PDF export.
  - Dedicated **My Certificates** library & instant **Certificate Verification** tool for recruiters.
- **Interactive Performance Intelligence**: Real-time `recharts` graphs for skill trajectory, proctored accuracy, credibility breakdown, and national cohort peer percentiles (`Top 14%`).
- **CredAI Assistant**: Persistent, context-aware AI recruitment advisor guiding profile enhancement and technical verification.

---

## 3. Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom SaaS tokens (`brand-500/600`, `badge-verified`, `badge-claimed`, `shadow-card`)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **State Management**: Context API with persistent LocalStorage synchronization (`recruitcred_state_v1`)

---

## 4. Project Structure

```text
src/
├── components/
│   ├── assessments/          # Assessment catalog, runner timer, and results
│   ├── auth/                 # Auth modal & 1-click evaluation personas
│   ├── chat/                 # CredAI assistant UI (ChatButton, ChatWindow, MessageBubble, QuickActions)
│   ├── credibility/          # Interactive CredibilitySnapshot hero visualization
│   ├── dashboard/            # Student dashboard, readiness stats, activity stream
│   ├── invitations/          # Team invites & pending skill challenges
│   ├── landing/              # Clean campus recruitment SaaS landing page
│   ├── layout/               # Navbar with persona switcher, Sidebar, Footer
│   ├── profile/              # Candidate profile, verified projects, certifications
│   ├── settings/             # User settings & clean presentation reset button
│   ├── skills/               # Skills Hub, AddSkillModal, VerifySkillModal
│   └── teams/                # Find Teammates, TeamDetails, TeamSkillChallengeModal
├── context/
│   └── AppContext.tsx        # Centralized state store, navigation, LocalStorage sync
├── mockData/
│   └── initialData.ts        # Seed candidates, assessments, questions, teams
├── services/
│   └── ai/                   # CredAI service, context builder, system prompts, fallback engine
└── types/
    ├── index.ts              # Core data models (User, Skill, Assessment, Team, Challenge)
    └── chat.ts               # Chatbot message & context interfaces
```

---

## 5. Setup Instructions

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation
```bash
# 1. Clone repository
git clone <repo-url>
cd Hacathon

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
The app will start at `http://127.0.0.1:5173/`.

### Production Build
```bash
npm run build
```

---

## 6. Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_APP_NAME` | Platform Name | `RecruitCred` |
| `VITE_APP_ENV` | Environment | `development` |
| `VITE_AI_API_URL` | Optional external AI proxy endpoint | `""` |
| `VITE_AI_API_KEY` | Optional AI provider API key | `""` |

*Note: If no external AI endpoint is specified, CredAI automatically operates using its built-in, data-aware contextual intelligence engine.*

---

## 7. How Authentication Works

- **Get Started (Onboarding Wizard)**:
  1. *Account Type*: Student (primary/default) vs. Recruiter.
  2. *Credentials & Unique ID*: Full name, email, Unique User ID (e.g. `agastya_28`, with real-time uniqueness validation), and secure password.
  3. *Tell Us Where You Study*: Searchable college directory (`Thapar`, `IITs`, `BITS`, `NITs`, `DTU`, etc.), branch selector, and graduation year.
  4. *Profile Setup & Skills*: Optional GitHub/LeetCode handles, initial skill claims, and instant transition to the personalized dashboard.
- **Sign In (Existing Users)**:
  - Supports login via RecruitCred ID (`username`) or registered email + password.
  - Generic error responses prevent account enumeration.
  - Fast-track 1-click login buttons for hackathon evaluation personas (**Rahul Sharma** & **Rohan Verma**).
- **Session Management**: Authenticated state is securely persisted in LocalStorage (`recruitcred_state_v1_auth`).

---

## 8. How Assessments Work

1. **Assessment Center Navigation**:
   - **Available Assessments**: Multi-disciplinary technical evaluations with question count, duration, difficulty, level, and verification contribution (+8%). Includes a **Recommended For You** engine tailored to target opportunities.
   - **Locked Assessments**: Enforces server-validated prerequisite rules (e.g. *Advanced Python requires Python Fundamentals ≥ 75%*).
   - **Assessment History**: Audit log of all completed attempts with scores, timestamps, accuracy ratios, and certificate links.
   - **My Assignments**: Company take-home technical challenges categorized into `Assigned`, `In Progress`, `Completed`, and `Expired`.
   - **Verification Appointments**: Scheduled evaluator reviews and live code walkthroughs.
   - **Skill Progression**: 4-tier structured progression (`Level 1 Fundamentals` ➔ `Level 4 Professional`) with transparent factor breakdown (*35% Assessment + 35% Static Code Proof + 30% Project Demonstration*).

2. **Pre-Assessment Setup & System Check**:
   - Pre-flight briefing detailing parameters, syllabus, and rules.
   - Interactive live **System Check**: Camera sensor check with live HUD, supported browser test, display resolution check, network latency ping, fullscreen capability, and Single Session Lock generation (`RC_SESSION_XXXXXXXX`).

3. **Proctored Assessment Runner**:
   - Unobtrusive live webcam sensor tile and live timer.
   - Continuous attention/liveness tracking over rolling time windows.
   - Browser tab focus loss & fullscreen exit listeners with non-accusatory pause overlays.
   - Dynamic internal **Integrity Status** (`Normal`, `Attention Required`, `Additional Verification Recommended`).

4. **Results & Credentials**:
   - **Passed Flow**: Level verified, Next Level unlocked, RecruitCred Digital Certificate generated (`RC-XX-2026-XXXXXX`) with instant PDF download.
   - **Failed Flow**: Detailed recommended learning syllabus areas, passing threshold comparison, and retry cooldown policy.

---

## 9. How Verification Works

RecruitCred applies a transparent multi-layer verification model:
1. **Proctored Assessments**: Timed, randomized code evaluations grading theoretical and output-prediction competencies.
2. **Code Repository Proof**: Static repository inspection (commit velocity, unit test coverage, AST syntax parsing).
3. **Project Demonstration**: Live evaluator walkthroughs or practical task submissions.
4. **Cryptographic Certificate**: Tamper-proof digital credentials verifiable via `https://recruitcred.dev/verify/RC-XX-2026-XXXXXX`.

---

## 10. How CredAI Works

- **Trigger**: Small floating bot button in the bottom-right corner of authenticated views.
- **Context Injection**: Uses `buildChatContext()` to feed sanitized data (active page, verified skills count, claimed skills list, overall score) into responses.
- **Dynamic Advice**:
  - Recommends which claimed skills to verify first based on actual profile gaps.
  - Explains verification criteria and score meaning.
  - Guides recruiters on evaluating project code repositories.
- **Security Boundaries**: Strictly refuses manual score edits or state manipulation attempts.

---

## 11. Security Considerations

- **No Exposed Secrets**: Zero hardcoded API keys in frontend source code.
- **Safe Output Rendering**: Chatbot output is rendered safely through formatted token trees without `dangerouslySetInnerHTML`.
- **Client Integrity**: State manipulation commands (e.g. "set score to 100") are intercepted and rejected by CredAI.
- **Input Sanitization**: Text areas and chat inputs are bounded by character limits and string trimming.

---

## 12. Demo Credentials & Evaluation Personas

For instant 1-click evaluation during presentations:

| Persona | Name | Role | Focus |
| :--- | :--- | :--- | :--- |
| **Student** | **Rahul Sharma** | B.Tech CS '26 (IIT Bombay) | 92% Python, 86% React, C++ Claimed |
| **Recruiter / Team Lead** | **Rohan Verma** | Backend Lead (Team Alpha) | Dispatches skill tests, reviews candidate proof |

To reset demo data back to clean baseline anytime, visit **Settings** ➔ click **"Reset Demo State"**.
