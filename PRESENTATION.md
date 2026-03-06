# CODEC — Coder's Development & Evolution Command Center
## Project Presentation Document

> **Tagline:** Type better. Learn deeper. Build smarter.

---

## Table of Contents

1. [What is CODEC?](#1-what-is-codec)
2. [Complete Feature List](#2-complete-feature-list)
3. [System Architecture](#3-system-architecture)
4. [How It Works — Non-Technical Flowchart](#4-how-it-works--non-technical-flowchart)
5. [How It Works — Technical Flowchart](#5-how-it-works--technical-flowchart)
6. [ML Pipeline Deep Dive](#6-ml-pipeline-deep-dive)
7. [Future Integrations](#7-future-integrations)
8. [Slide Topics for Presentation](#8-slide-topics-for-presentation-6-slides)

---

## 1. What is CODEC?

CODEC is a **full-stack, gamified learning platform** that combines a **ML-powered typing trainer** with a **technology learning OS** and **AI tutoring** — all in a single premium-looking web application.

It is built for developers and digital artists who want to:
- Master touch typing with structured lessons and real-time ML feedback
- Follow learning roadmaps across 10 technologies (C++, UE5, Blender, Python, PyTorch, etc.)
- Get AI-powered code reviews, tutoring, and personalized coaching
- Track their entire learning journey with XP, ranks, streaks, and analytics

---

## 2. Complete Feature List

### Authentication & User Management
| Feature | Description |
|---------|-------------|
| Multi-user auth | Registration & login with JWT tokens |
| Bcrypt password hashing | Secure password storage |
| User profiles | Customizable name, avatar, active technology |
| Onboarding flow | First-time user survey and tutorial walkthrough |
| Account management | Change password, delete account (type DELETE to confirm) |

### The Gate System (Daily Typing Check-in)
| Feature | Description |
|---------|-------------|
| Daily typing gate | Full-screen typing session that greets users every day |
| Configurable duration | 1 / 2 / 3 / 5 / 10 minute options |
| Progressive difficulty | Content matches user's current lesson level |
| 3-day content rotation | Words → Code → Sentences cycle |
| Free skip option | No penalty — just tracked for analytics |
| Live SVG keyboard | Real-time finger highlighting during gate |

### Typing Trainer (5 Tabs)
| Feature | Description |
|---------|-------------|
| Free Practice | Words / Code / Sentences modes with adjustable durations |
| 8-Level Lesson Curriculum | From Home Row basics to real code snippets |
| Comprehensive Stats | WPM charts, accuracy charts, keyboard heatmap, finger performance, bigram analysis |
| ML Analysis | 3-model machine learning pipeline for typing diagnostics |
| Finger Guide | Full SVG QWERTY keyboard color-coded by finger assignment |
| Live Typing Engine | Character-by-character highlighting with real-time WPM/accuracy |
| AI Bonus Drills | Gemini-generated drills based on ML weak points |

### Machine Learning Pipeline
| Feature | Description |
|---------|-------------|
| Weak Key Classifier | Random Forest model — identifies weak keys by latency and error rate |
| WPM Growth Predictor | Polynomial Regression — projects WPM at 30/60/90 sessions |
| Typing Fingerprint | K-Means Clustering — classifies typing style (Burst / Steady / Hesitant / Fatiguing) |
| AI Overview | Gemini analyzes ML report and provides coaching advice + custom drills |

### Learning OS
| Feature | Description |
|---------|-------------|
| Technology Roadmap | 10 technologies across 3 layers (Game Dev / AI / Federation) |
| Resource Library | User-curated free resources (Videos, Books, Courses, Articles) with YouTube inline embed |
| Flashcards | 200+ pre-seeded cards across 10 technologies with 3D flip animation |
| Notes System | Per-technology markdown notes with auto-save and full-text search |
| Weekly Schedule | Flexible user-created weekly learning plan |
| Mini Projects | 10 guided projects (one per tech) with sub-task checklists |

### Code Playground
| Feature | Description |
|---------|-------------|
| Monaco Editor | Full VS Code experience in browser |
| Multi-language | Python (Pyodide — runs in browser), JavaScript (sandboxed), C++ (syntax only) |
| AI Code Review | Gemini provides line-specific feedback on code |
| Save & Load | Snippets saved to MongoDB |

### AI Tutor
| Feature | Description |
|---------|-------------|
| Chat interface | Real-time conversation with Google Gemini |
| Context-aware | Auto-injects user's active tech, level, hours studied into system prompt |
| Code paste support | Mini Monaco editor inside chat input |
| Suggested prompts | 6 contextual prompts that change based on active technology |
| Conversation history | Last 50 messages persisted in MongoDB |

### Dashboard & Analytics
| Feature | Description |
|---------|-------------|
| XP & Level Bar | Visual progress with dual-color typing/learning segments |
| Study Timer | Auto-running timer with tab-blur pause detection |
| Quick Stats | Hours this week, current WPM, tech progress %, daily sessions |
| Study Chart | 14-day Recharts area chart (typing time + learning time) |
| Next Action Card | Gemini-generated or static recommendation |
| Status Board | Daily tasks checklist from both typing and learning modules |

### Gamification System
| Feature | Description |
|---------|-------------|
| XP System | 20+ distinct XP-earning actions across all features |
| 8 NPC Ranks | From "Dormant NPC" (0 XP) to "THE FINAL BOSS" (35,000 XP) |
| Dynamic Streak | Bronze / Silver / Gold / Diamond streak tiers with animated flames |
| 40 Achievement Badges | 15 Typing + 15 Learning + 10 Cross-System rare badges |

### Design & UX
| Feature | Description |
|---------|-------------|
| Neo-Brutalist / Cyberpunk theme | High-contrast neon-on-dark premium aesthetic |
| React Bits animations | Aurora, Sparkles, Confetti, GlitchText, ShuffleText, TiltCard, etc. |
| Custom typography | Bricolage Grotesque (headings), Inter (body), JetBrains Mono (code), Orbitron (ranks) |
| Micro-animations | Counter animations, progress bar fills, card tilts, neon glows |

---

## 3. System Architecture

### Tech Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CODEC ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    FRONTEND (Client)                     │   │
│   │  React 19 + Vite | Zustand | Tailwind CSS | Monaco     │   │
│   │  Recharts | Framer Motion | React Bits | Pyodide       │   │
│   └──────────────────────┬──────────────────────────────────┘   │
│                          │ REST API (HTTP/JSON)                  │
│   ┌──────────────────────▼──────────────────────────────────┐   │
│   │                    BACKEND (Server)                       │   │
│   │  Node.js + Express 5 | JWT Auth | Bcrypt                │   │
│   │  Mongoose ODM | Gemini API Client | ML Bridge            │   │
│   └───────┬─────────────┬──────────────────┬────────────────┘   │
│           │             │                  │                     │
│   ┌───────▼──────┐ ┌────▼─────────┐ ┌─────▼──────────────┐     │
│   │   MongoDB    │ │  Gemini API  │ │  Python ML Script  │     │
│   │  (Database)  │ │  (Google AI) │ │  (scikit-learn)    │     │
│   └──────────────┘ └──────────────┘ └────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Layer-by-Layer Breakdown

| Layer | Technology | Role |
|-------|-----------|------|
| **Frontend** | React 19 + Vite | Single Page Application with hot module replacement |
| **State** | Zustand | Lightweight client-side state management (auth, typing, app, timer, notes) |
| **Styling** | Tailwind CSS | Utility-first CSS with custom cyberpunk design tokens |
| **Editor** | Monaco Editor | VS Code-grade in-browser code editing |
| **Python Runtime** | Pyodide (WASM) | Execute real Python code directly in the browser |
| **Charts** | Recharts | Progress analytics and typing performance visualization |
| **Backend** | Node.js + Express | RESTful API with 30+ endpoints |
| **Database** | MongoDB + Mongoose | Document-based storage for all user data (10 collections) |
| **Authentication** | JWT + Bcrypt | Stateless token-based auth with secure password hashing |
| **AI Engine** | Google Gemini Pro | Code review, tutoring, and ML analysis interpretation |
| **ML Pipeline** | Python + scikit-learn | 3-model typing analysis (Random Forest, Polynomial Regression, K-Means) |

### Database Collections (10)

```
MongoDB
 ├── users              → Auth, profile, settings, XP, rank, streak
 ├── typingSessions      → Full keypress data per session (6 data points/key)
 ├── progress            → XP, tech progress, lesson/project completion
 ├── notes               → Per-technology markdown notes
 ├── achievements        → Unlocked badges with timestamps
 ├── chatHistory         → AI Tutor conversation logs (last 50 msgs)
 ├── codeSnippets        → Saved playground code (name, language, code)
 ├── mlAnalysis          → ML reports + Gemini advice JSON
 ├── flashcardProgress   → Card review stats (reviewed, correct, difficulty)
 └── scheduleWeeks       → User-created weekly learning plans
```

### API Endpoint Map (30+ Routes)

```
/api/auth/         → register, login, me, profile, password, account
/api/typing/       → session (save), sessions (history), stats (aggregated)
/api/ml/           → analyze (trigger ML), report (get results), gemini-overview
/api/progress/     → get, update, xp (add event)
/api/flashcards/   → get (by tech), :id/progress (update review)
/api/schedule/     → CRUD (create, read, update, delete weeks)
/api/notes/        → get/update per techId
/api/snippets/     → get, save, delete code snippets
/api/tutor/        → history, chat (Gemini conversation)
/api/achievements/ → get (badges), check (unlock new)
```

---

## 4. How It Works — Non-Technical Flowchart

This is how CODEC looks from a **user's perspective** — no code, just the experience.

```
                        ┌──────────────┐
                        │  First Visit │
                        └──────┬───────┘
                               │
                        ┌──────▼───────┐
                        │   Sign Up    │
                        │ (Name/Email) │
                        └──────┬───────┘
                               │
                  ┌────────────▼────────────┐
                  │   Onboarding Survey     │
                  │ • Typing speed estimate │
                  │ • Pick starting tech    │
                  │ • Set weekly hours goal │
                  └────────────┬────────────┘
                               │
              ┌────────────────▼────────────────┐
              │      DAILY LOOP STARTS HERE     │
              └────────────────┬────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Typing Gate      │
                    │  (Daily Practice)   │
                    │                     │
                    │  Type for X minutes │
                    │  See live keyboard  │
                    │  Get WPM & accuracy │
                    │                     │
                    │  [Skip if needed]   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │     Dashboard       │
                    │  (Your Home Base)   │
                    │                     │
                    │  • Today's stats    │
                    │  • XP & level       │
                    │  • Study streak     │
                    │  • What to do next  │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
   ┌────────▼───────┐  ┌──────▼──────┐  ┌───────▼───────┐
   │  TYPING SIDE   │  │  LEARNING   │  │    TOOLS      │
   │                │  │   SIDE      │  │               │
   │ • Practice     │  │ • Roadmap   │  │ • Code Editor │
   │ • Lessons      │  │ • Resources │  │ • AI Tutor    │
   │ • ML Analysis  │  │ • Flashcards│  │ • Notes       │
   │ • Stats        │  │ • Schedule  │  │ • Settings    │
   │                │  │ • Projects  │  │               │
   └────────┬───────┘  └──────┬──────┘  └───────┬───────┘
            │                  │                  │
            └──────────────────┼──────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Earn XP & Level   │
                    │      Up Rank        │
                    │                     │
                    │  Dormant NPC ──────►│
                    │  Script Initialised │
                    │  Pattern Recognition│
                    │  ...                │
                    │  THE FINAL BOSS     │
                    └─────────────────────┘
```

### Simple User Journey

1. **Sign up** → Create an account with name and email
2. **Set up profile** → Tell CODEC your typing level, pick a tech to learn, set weekly goals
3. **Every day** → Complete a short typing practice gate (or skip it)
4. **Dashboard** → See your stats, streak, XP, and recommendations
5. **Practice typing** → Work through 8 levels from home row keys to real code
6. **Learn technologies** → Follow roadmaps, watch resources, review flashcards
7. **Build projects** → Complete mini projects for each technology
8. **Get AI help** → Ask the AI Tutor questions, get code reviewed
9. **Run ML analysis** → Machine learning analyzes your typing patterns and tells you how to improve
10. **Level up** → Earn XP from everything you do, climb from "Dormant NPC" to "THE FINAL BOSS"

---

## 5. How It Works — Technical Flowchart

### Full System Data Flow

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React + Vite)                            │
│                                                                           │
│  ┌──────────┐   ┌──────────┐   ┌───────────┐   ┌──────────────────────┐  │
│  │ Zustand   │   │ React    │   │  Monaco   │   │  Pyodide (WASM)     │  │
│  │ Stores    │◄──│ Pages    │   │  Editor   │   │  Python Runtime     │  │
│  │ (5 stores)│   │ (14)     │   │           │   │                     │  │
│  └─────┬─────┘   └────┬─────┘   └─────┬─────┘   └──────────┬─────────┘  │
│        │              │               │                     │            │
│        └──────────────┼───────────────┼─────────────────────┘            │
│                       │               │                                  │
│              ┌────────▼───────────────▼────────┐                         │
│              │     API Service Layer            │                         │
│              │  (auth.js, typing.js,            │                         │
│              │   progress.js, learning.js)      │                         │
│              └────────────────┬─────────────────┘                         │
└───────────────────────────────┼───────────────────────────────────────────┘
                                │
                     HTTP REST (JSON + JWT Bearer Token)
                                │
┌───────────────────────────────▼───────────────────────────────────────────┐
│                       SERVER (Node.js + Express)                          │
│                                                                           │
│  ┌────────────┐   ┌──────────────────┐   ┌─────────────────────────────┐ │
│  │ Auth       │   │  Route Handlers  │   │  Middleware                 │ │
│  │ Middleware │──►│  (8 route files)  │   │  • JWT verification        │ │
│  │ (JWT)      │   │                  │   │  • Request validation      │ │
│  └────────────┘   └────────┬─────────┘   └─────────────────────────────┘ │
│                            │                                              │
│              ┌─────────────┼─────────────┐                                │
│              │             │             │                                │
│    ┌─────────▼───┐  ┌─────▼──────┐  ┌───▼──────────────┐                │
│    │   Mongoose  │  │  Gemini    │  │  ML Bridge       │                │
│    │   ODM       │  │  Service   │  │  (child_process) │                │
│    │             │  │            │  │                   │                │
│    └──────┬──────┘  └─────┬──────┘  └────────┬──────────┘                │
│           │               │                  │                            │
└───────────┼───────────────┼──────────────────┼────────────────────────────┘
            │               │                  │
   ┌────────▼────────┐  ┌───▼──────────┐  ┌───▼──────────────────┐
   │    MongoDB      │  │  Google      │  │  Python Process      │
   │  (10 collections│  │  Gemini API  │  │  (scikit-learn)      │
   │   see above)    │  │  (Cloud)     │  │                      │
   └─────────────────┘  └──────────────┘  │  Model 1: Random     │
                                          │    Forest (Weak Keys)│
                                          │  Model 2: PolyReg    │
                                          │    (WPM Prediction)  │
                                          │  Model 3: K-Means    │
                                          │    (Typing Profile)  │
                                          └──────────────────────┘
```

### Authentication Flow (Technical)

```
  Client                          Server                        MongoDB
    │                               │                              │
    │  POST /api/auth/register      │                              │
    │  {name, email, password}      │                              │
    │──────────────────────────────►│                              │
    │                               │  bcrypt.hash(password, 10)   │
    │                               │  User.create({...})          │
    │                               │─────────────────────────────►│
    │                               │◄─────────────────────────────│
    │                               │  jwt.sign({userId, email},   │
    │                               │    JWT_SECRET, {expiresIn:7d})│
    │  {token, user}                │                              │
    │◄──────────────────────────────│                              │
    │                               │                              │
    │  All subsequent requests:     │                              │
    │  Authorization: Bearer <token>│                              │
    │──────────────────────────────►│                              │
    │                               │  jwt.verify(token) →        │
    │                               │  attach req.user             │
    │                               │                              │
```

### Typing Session Data Flow (Technical)

```
  Browser (React)              Express API               MongoDB         Python ML
       │                           │                        │                │
       │  User types...            │                        │                │
       │  Capture per keypress:    │                        │                │
       │  • key, expectedKey       │                        │                │
       │  • isCorrect (boolean)    │                        │                │
       │  • timestampMs            │                        │                │
       │  • prevKey (bigram)       │                        │                │
       │  • holdMs (key down→up)   │                        │                │
       │  • interKeyMs             │                        │                │
       │                           │                        │                │
       │  Session ends...          │                        │                │
       │  POST /api/typing/session │                        │                │
       │  {mode, wpm, accuracy,    │                        │                │
       │   keypresses[], ...}      │                        │                │
       │─────────────────────────►│                        │                │
       │                           │  TypingSession.create() │                │
       │                           │───────────────────────►│                │
       │                           │◄───────────────────────│                │
       │  {session saved}          │                        │                │
       │◄─────────────────────────│                        │                │
       │                           │                        │                │
       │ User clicks "Run ML"     │                        │                │
       │ POST /api/ml/analyze     │                        │                │
       │─────────────────────────►│                        │                │
       │                           │  Fetch all sessions    │                │
       │                           │───────────────────────►│                │
       │                           │◄───────────────────────│                │
       │                           │                        │                │
       │                           │  spawn('python',       │                │
       │                           │   ['codec_typing_ml.py'])               │
       │                           │  stdin: JSON sessions   │                │
       │                           │───────────────────────────────────────►│
       │                           │                        │                │
       │                           │                        │    Train 3     │
       │                           │                        │    models...   │
       │                           │                        │                │
       │                           │  stdout: analysis JSON  │                │
       │                           │◄───────────────────────────────────────│
       │                           │                        │                │
       │                           │  MlAnalysis.create()   │                │
       │                           │───────────────────────►│                │
       │  {analysis report}        │                        │                │
       │◄─────────────────────────│                        │                │
       │                           │                        │                │
       │ User clicks "AI Overview" │                        │                │
       │ POST /api/ml/gemini      │                        │                │
       │─────────────────────────►│                        │                │
       │                           │  Gemini.generateContent()               │
       │                           │──────────────►Google Gemini API         │
       │                           │◄──────────────                          │
       │  {AI coaching advice}     │                        │                │
       │◄─────────────────────────│                        │                │
```

---

## 6. ML Pipeline Deep Dive

### Input: 6 Data Points Per Keypress

Every single keypress during a typing session is recorded with:

| # | Data Point | What It Measures | Example |
|---|-----------|-----------------|---------|
| 1 | `key` | The character pressed | `'a'` |
| 2 | `isCorrect` | Did it match the expected character? | `true` |
| 3 | `timestampMs` | High-precision timing | `1432.75` |
| 4 | `prevKey` | Previous key (for bigram analysis) | `'s'` |
| 5 | `holdMs` | How long the key was held down (keydown → keyup) | `85` |
| 6 | `interKeyMs` | Time between releasing the last key and pressing this one | `120` |

### Model 1: Weak Key Classifier (Random Forest)

```
INPUT                              PROCESS                         OUTPUT
┌─────────────────┐    ┌────────────────────────────┐    ┌──────────────────┐
│ Per-key features │    │  Random Forest Classifier  │    │  Each key labeled│
│                  │    │                            │    │                  │
│ • avg_latency_ms │───►│  Train on aggregated       │───►│  STRONG          │
│ • error_rate     │    │  per-key statistics        │    │  AVERAGE         │
│ • hold_variance  │    │  from all user sessions    │    │  WEAK            │
│ • backspace_freq │    │                            │    │                  │
│ • session_count  │    │                            │    │  + per-key stats │
└─────────────────┘    └────────────────────────────┘    └──────────────────┘
```

**Purpose:** Identifies which specific keys the user struggles with, ranked by weakness.

### Model 2: WPM Growth Predictor (Polynomial Regression)

```
INPUT                              PROCESS                         OUTPUT
┌─────────────────┐    ┌────────────────────────────┐    ┌──────────────────┐
│ Session-level    │    │  Degree-2 Polynomial       │    │  Current WPM     │
│ features         │    │  Regression                │    │                  │
│                  │───►│                            │───►│  Predicted WPM:  │
│ • session_number │    │  Fits growth curve to      │    │   @ 30 sessions  │
│ • cumulative_time│    │  user's WPM progression    │    │   @ 60 sessions  │
│ • days_elapsed   │    │                            │    │   @ 90 sessions  │
│                  │    │                            │    │                  │
│                  │    │                            │    │  Days to 60 WPM  │
└─────────────────┘    └────────────────────────────┘    └──────────────────┘
```

**Purpose:** Projects how fast the user's WPM will grow with continued practice.

### Model 3: Typing Fingerprint (K-Means Clustering)

```
INPUT                              PROCESS                         OUTPUT
┌─────────────────┐    ┌────────────────────────────┐    ┌──────────────────┐
│ Rhythm features  │    │  K-Means Clustering (K=4)  │    │  Profile Type:   │
│                  │    │                            │    │                  │
│ • inter-key      │───►│  Clusters user into one    │───►│  • Burst Typist  │
│   latency seqs   │    │  of 4 typing profiles      │    │  • Steady Rhythm │
│ • bigram latency │    │  based on timing patterns   │    │  • Hesitant      │
│   matrix         │    │                            │    │  • Fatiguing     │
│                  │    │                            │    │                  │
│                  │    │                            │    │  Top 20 slowest  │
│                  │    │                            │    │  bigrams         │
│                  │    │                            │    │  Fatigue onset   │
└─────────────────┘    └────────────────────────────┘    └──────────────────┘
```

**Purpose:** Classifies the user's overall typing rhythm pattern and identifies specific letter-pair bottlenecks.

### ML → Gemini AI Link

After ML analysis, the user can optionally request an **AI Overview** from Google Gemini:

```
┌────────────────────┐         ┌──────────────┐         ┌────────────────────┐
│  ML Analysis       │         │  Google      │         │  AI Coaching       │
│  Report            │────────►│  Gemini API  │────────►│  Response          │
│                    │         │              │         │                    │
│  • Weak keys list  │  prompt │  "You are a  │  JSON   │  • 2-line summary  │
│  • WPM projection  │  ──────►│   typing     │  ──────►│  • 3 improvement   │
│  • Typing profile  │         │   coach..."  │         │    actions (ranked)│
│  • Bigram data     │         │              │         │  • 3 bonus drills  │
│  • Stats           │         │              │         │  • Motivational msg│
└────────────────────┘         └──────────────┘         └────────────────────┘
```

---

## 7. Future Integrations

### Short-Term (Next 3-6 months)

| Integration | Description | Impact |
|------------|-------------|--------|
| **Google Drive Media Proxy** | Replace local storage with Google Drive via Firebase Cloud Functions for video/resource streaming | Scalable media storage |
| **Real-time Multiplayer Typing** | WebSocket-based typing races between users | Community engagement |
| **Spaced Repetition Algorithm** | SM-2 algorithm for flashcard scheduling (like Anki) | Better learning retention |
| **Advanced Code Execution** | Piston API integration for sandboxed C++ and multi-language server-side execution | Full code playground |
| **Export & Sharing** | PDF progress reports, shareable typing stats cards | Portfolio building |

### Mid-Term (6-12 months)

| Integration | Description | Impact |
|------------|-------------|--------|
| **V-Mobile (Android App)** | Companion app for theory content, flashcard review, and progress tracking | Learning on the go |
| **Collaborative Challenges** | Multiplayer coding sessions and timed coding competitions | Social learning |
| **Project Showcases** | Peer-review system for Blender renders, C++ projects, etc. | Community portfolio |
| **Advanced ML Models** | Deep learning models (LSTM) for typing pattern prediction, fatigue detection | Smarter diagnostics |
| **GitHub Integration** | Link GitHub repos to mini projects, auto-track coding activity | Developer workflow |

### Long-Term (12+ months)

| Integration | Description | Impact |
|------------|-------------|--------|
| **Enterprise/White-Label** | Corporate training lab version with custom branding and admin dashboard | B2B market |
| **Federated Learning Modules** | Practical hands-on labs for federated learning education | Advanced AI curriculum |
| **Voice-Based AI Tutor** | Speech-to-text integration for verbal Q&A with the AI tutor | Accessibility |
| **VS Code Extension** | Lightweight CODEC sidebar inside VS Code — typing drills + flashcards while coding | Developer integration |
| **Learning Path Marketplace** | Community-created roadmaps and curricula that others can import | User-generated content |
| **Adaptive Difficulty Engine** | AI that auto-adjusts lesson difficulty, gate content, and challenge pacing based on real-time performance | Personalized learning |

---

## 8. Slide Topics for Presentation (6 Slides)

### Slide 1: The Problem & Our Solution
**Title:** *"Why CODEC Exists"*

**Content to cover:**
- The problem: Developers need efficient typing + structured learning but existing tools are fragmented (typing trainers are separate from learning platforms, no AI guidance, no ML analytics)
- The solution: CODEC unifies typing mastery, technology learning, AI tutoring, and ML-powered diagnostics into one gamified platform
- Tagline: "Type better. Learn deeper. Build smarter."
- Quick visual: side-by-side of fragmented tools vs. CODEC's unified approach

---

### Slide 2: Core Architecture & Tech Stack
**Title:** *"How It's Built"*

**Content to cover:**
- 3-tier architecture diagram: React Frontend → Express Backend → MongoDB
- External integrations: Google Gemini API (AI) + Python scikit-learn (ML)
- Key tech choices and WHY:
  - React + Vite (fast development)
  - Zustand (lightweight state)
  - MongoDB (flexible document schemas for diverse data types)
  - JWT (stateless auth, scalable)
- Show the 30+ API endpoints and 10 MongoDB collections
- Highlight: Pyodide for in-browser Python execution

---

### Slide 3: The ML-Powered Typing System
**Title:** *"Machine Learning Meets Typing"*

**Content to cover:**
- 6 data points captured per keypress (latency, hold, accuracy, bigrams)
- 3 ML models and what each does:
  - Random Forest → identifies weak keys
  - Polynomial Regression → predicts WPM growth
  - K-Means → classifies typing style
- Data flow: Keypress → MongoDB → Python ML → Analysis Report → Gemini AI Coaching
- Live demo / screenshot of: Keyboard heatmap, WPM projection chart, typing fingerprint card
- The AI layer: Gemini interprets ML results into human-readable coaching advice

---

### Slide 4: The Learning Operating System
**Title:** *"More Than a Typing Trainer"*

**Content to cover:**
- 12 integrated pages: Dashboard, Typing, Roadmap, Resources, Code Playground, Flashcards, AI Tutor, Schedule, Notes, Mini Projects, Settings, Achievements
- 10 technologies across 3 layers (Game Dev → AI → Federated Learning)
- Code Playground: Monaco Editor + Pyodide (real Python in browser)
- AI Tutor: Context-aware Gemini chat that knows your level, tech, and progress
- 200+ pre-seeded flashcards with spaced review
- Flexible schedule + per-tech notes with auto-save

---

### Slide 5: User Experience & Design
**Title:** *"The CODEC Experience"*

**Content to cover:**
- The daily loop: Splash → Gate → Dashboard → Learn/Type → Level Up
- Neo-Brutalist / Cyberpunk design philosophy: neon-on-dark, premium feel
- Gate system: configurable daily typing check-in with progressive difficulty
- Onboarding flow: 3-question survey → tutorial → first gate
- React Bits animations: Aurora backgrounds, Sparkles, Confetti, GlitchText
- Gamification: XP system, 8 NPC ranks, dynamic streak flames (Bronze→Diamond)
- Show screenshots: Dashboard, Typing page, Gate screen, Code Playground

---

### Slide 6: Future Roadmap & Scalability
**Title:** *"What's Next for CODEC"*

**Content to cover:**
- Short-term: Multiplayer typing races, Piston API for C++ execution, spaced repetition flashcards
- Mid-term: V-Mobile companion app, project showcases, GitHub integration
- Long-term: Enterprise white-label, VS Code extension, adaptive difficulty AI
- Scalability considerations:
  - Stateless JWT auth = horizontally scalable backend
  - MongoDB Atlas for cloud database
  - ML pipeline can be containerized (Docker) for parallel processing
  - Gemini API rate limiting handled with queue system
- Vision: CODEC as the **single platform** where developers build every skill they need

---

*Document prepared for project presentation — March 2026*
