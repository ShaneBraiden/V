# BUILD CODEC — Coder's Development & Evolution Command Center

You are building **CODEC**, a full-stack multi-user web application that combines a typing trainer with an ML-powered analysis pipeline and a technology learning OS with AI tutoring. Read this entire document before writing a single line of code. This is your single source of truth.

---

## ARCHITECTURE OVERVIEW

```
codec/
├── client/          → Vite + React 18 frontend
├── server/          → Node.js + Express backend
├── ml/              → Python ML pipeline (scikit-learn)
└── README.md
```

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | Vite + React 18 (JSX, no TypeScript) | |
| Styling | Tailwind CSS v3 | Dark cyberpunk theme |
| Client State | Zustand | Syncs with backend API |
| Routing | React Router v6 | |
| Backend | Express.js | REST API |
| Database | MongoDB + Mongoose | All user data persisted here |
| Auth | JWT + bcrypt | Stateless auth |
| Code Editor | Monaco Editor (`@monaco-editor/react`) | |
| Python in Browser | Pyodide (CDN) | |
| Charts | Recharts | |
| Icons | Lucide React | |
| AI | Google Gemini API | Single model, key in server `.env` |
| ML | Python + scikit-learn | 3-model typing analysis |
| Animations | Components from [reactbits.dev](https://reactbits.dev/) | Copy/paste components |

---

## RULE 0 — BUILD ORDER IS NON-NEGOTIABLE

Follow this exact sequence. Do **not** skip ahead.

### Step 1: Scaffold
1. Create `client/` with `npm create vite@latest client -- --template react`
2. Create `server/` with `npm init -y` and install Express, Mongoose, bcryptjs, jsonwebtoken, cors, dotenv, `@google/generative-ai`
3. In `client/`: install `react-router-dom zustand @monaco-editor/react recharts lucide-react tailwindcss postcss autoprefixer @google/generative-ai`
4. Init Tailwind: `npx tailwindcss init -p`
5. Create every file and folder listed in the folder structure below as empty files with a single comment
6. Confirm `npm run dev` runs for both client (port 5173) and server (port 5000)

### Step 2: Backend First
Build in this order: DB config → Models → Auth middleware → Auth routes → All other routes → Flashcard seed script

### Step 3: Frontend Core
Build in this order: Tailwind theme → API service layer → Zustand stores → Auth pages (Login/Register) → Layout (Sidebar, TopBar, PageWrapper) → Protected routes → Onboarding → Gate

### Step 4: Pages
Build in this order: Settings → Dashboard → Typing → Roadmap → Resources → Schedule → Notes → MiniProjects → Flashcards → CodePlayground → AITutor → Achievements

### Step 5: Advanced Features
SVG Keyboard → ML Python script → Gemini integration → XP/Rank/Streak system → Achievement badge logic → React Bits animations

---

## COMPLETE FOLDER STRUCTURE

```
codec/
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── typing.js
│   │   │   ├── progress.js
│   │   │   └── learning.js
│   │   ├── store/
│   │   │   ├── useAuthStore.js
│   │   │   ├── useAppStore.js
│   │   │   ├── useTypingStore.js
│   │   │   ├── useTimerStore.js
│   │   │   └── useNotesStore.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Typing.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── CodePlayground.jsx
│   │   │   ├── Flashcards.jsx
│   │   │   ├── AITutor.jsx
│   │   │   ├── Schedule.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── MiniProjects.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Achievements.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── TopBar.jsx
│   │   │   │   ├── GateScreen.jsx
│   │   │   │   ├── PageWrapper.jsx
│   │   │   │   └── OnboardingFlow.jsx
│   │   │   ├── ui/
│   │   │   │   ├── NeonCard.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── XPBadge.jsx
│   │   │   │   ├── StreakBadge.jsx
│   │   │   │   └── Timer.jsx
│   │   │   ├── typing/
│   │   │   │   ├── TypingEngine.jsx
│   │   │   │   ├── LiveKeyboard.jsx
│   │   │   │   ├── FingerDiagram.jsx
│   │   │   │   ├── TypingText.jsx
│   │   │   │   ├── SessionStats.jsx
│   │   │   │   ├── LessonCard.jsx
│   │   │   │   ├── DrillCard.jsx
│   │   │   │   ├── KeyboardHeatmap.jsx
│   │   │   │   └── WPMProjectionChart.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── StudyChart.jsx
│   │   │   │   └── NextStepCard.jsx
│   │   │   ├── roadmap/
│   │   │   │   ├── TechCard.jsx
│   │   │   │   └── LayerSection.jsx
│   │   │   ├── resources/
│   │   │   │   ├── ResourceCard.jsx
│   │   │   │   └── TechFilter.jsx
│   │   │   ├── code/
│   │   │   │   ├── EditorPanel.jsx
│   │   │   │   ├── OutputPanel.jsx
│   │   │   │   └── LanguagePicker.jsx
│   │   │   ├── flashcards/
│   │   │   │   ├── FlashCard.jsx
│   │   │   │   └── CardControls.jsx
│   │   │   ├── tutor/
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   ├── ChatInput.jsx
│   │   │   │   └── SystemPrompt.js
│   │   │   └── achievements/
│   │   │       ├── BadgeCard.jsx
│   │   │       └── BadgeGallery.jsx
│   │   ├── hooks/
│   │   │   ├── useAutoTimer.js
│   │   │   ├── useGemini.js
│   │   │   ├── usePyodide.js
│   │   │   ├── useTypingSession.js
│   │   │   ├── useTypingAnalysis.js
│   │   │   ├── useNotifications.js
│   │   │   └── useXP.js
│   │   └── utils/
│   │       ├── xpCalc.js
│   │       ├── dateUtils.js
│   │       ├── geminiPrompts.js
│   │       ├── typingGeminiPrompt.js
│   │       └── fingerMap.js
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── index.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── TypingSession.js
│   │   ├── Progress.js
│   │   ├── Note.js
│   │   ├── Achievement.js
│   │   ├── ChatHistory.js
│   │   ├── CodeSnippet.js
│   │   ├── FlashcardProgress.js
│   │   ├── ScheduleWeek.js
│   │   └── MlAnalysis.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── typing.js
│   │   ├── progress.js
│   │   ├── learning.js
│   │   ├── tutor.js
│   │   ├── ml.js
│   │   ├── snippets.js
│   │   └── achievements.js
│   ├── services/
│   │   ├── gemini.js
│   │   └── mlBridge.js
│   ├── seeds/
│   │   └── flashcards.js        ← 200+ flashcards seed script
│   ├── .env
│   └── package.json
│
├── ml/
│   ├── codec_typing_ml.py
│   ├── requirements.txt
│   └── README.md
│
└── README.md
```

---

## SERVER `.env` FILE

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/codec
JWT_SECRET=your_jwt_secret_here_change_this
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## MONGODB SCHEMAS (Mongoose)

### User
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  avatar: { type: String, default: '' },
  activeTechId: { type: String, default: 'python' },
  onboardingComplete: { type: Boolean, default: false },
  weeklyHourTarget: { type: Number, default: 3 },
  reminderEnabled: { type: Boolean, default: false },
  reminderTime: { type: String, default: '09:00' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  rank: { type: String, default: 'Dormant NPC' },
  streak: {
    count: { type: Number, default: 0 },
    lastDate: { type: String, default: '' },
    type: { type: String, default: '' }, // bronze/silver/gold/diamond
    bestEver: { type: Number, default: 0 },
  },
  lastGateDate: { type: String, default: '' },
  gateSkipCount: { type: Number, default: 0 },
  gateDurationMinutes: { type: Number, default: 5 },
  totalStudySeconds: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}
```

### TypingSession
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: String,
  mode: String, // 'words' | 'code' | 'sentences'
  durationSecs: Number,
  wpm: Number,
  accuracy: Number,
  lessonId: String, // null if free practice
  isGate: Boolean,
  wasSkipped: Boolean,
  keypresses: [{
    key: String,
    expectedKey: String,
    isCorrect: Boolean,
    timestampMs: Number,
    prevKey: String,
    holdMs: Number,
    interKeyMs: Number,
  }],
  backspaces: [{
    errorKey: String,
    correctionMs: Number,
    timestampMs: Number,
  }],
  createdAt: { type: Date, default: Date.now },
}
```

### Progress
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  techProgress: { type: Map, of: {
    status: String, // 'not-started' | 'in-progress' | 'complete'
    progress: Number, // 0-100
    hoursSpent: Number,
  }},
  lessonProgress: { type: Map, of: Boolean }, // lessonId → completed
  levelProgress: { type: Map, of: Boolean }, // levelId → unlocked
  personalBests: { type: Map, of: Number }, // mode → best WPM
  projectProgress: { type: Map, of: {
    status: String,
    checklistItems: { type: Map, of: Boolean },
  }},
}
```

### FlashcardProgress
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cardId: String,
  timesReviewed: { type: Number, default: 0 },
  timesCorrect: { type: Number, default: 0 },
  difficulty: { type: String, default: 'medium' },
}
```

### ScheduleWeek
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  weekNumber: Number,
  techId: String,
  topic: String,
  task: String,
  targetHours: { type: Number, default: 3 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}
```

### Note
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  techId: String,
  content: { type: String, default: '' },
  wordCount: { type: Number, default: 0 },
  lastEdited: { type: Date, default: Date.now },
}
```

### Achievement
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  badgeId: String,
  unlockedAt: { type: Date, default: Date.now },
}
```

### ChatHistory
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    role: String, // 'user' | 'model'
    content: String,
    timestamp: { type: Date, default: Date.now },
  }],
}
```

### CodeSnippet
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  language: String,
  code: String,
  createdAt: { type: Date, default: Date.now },
}
```

### MlAnalysis
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionsTrained: Number,
  report: mongoose.Schema.Types.Mixed, // Full ML analysis JSON
  geminiAdvice: mongoose.Schema.Types.Mixed, // Gemini response JSON (null until requested)
  createdAt: { type: Date, default: Date.now },
}
```

---

## API ROUTES

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login → JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile/settings |
| PUT | `/api/auth/password` | Yes | Change password |
| DELETE | `/api/auth/account` | Yes | Delete account |
| POST | `/api/typing/session` | Yes | Save typing session (full keypress data) |
| GET | `/api/typing/sessions` | Yes | Get session history |
| GET | `/api/typing/stats` | Yes | Get aggregated typing stats |
| POST | `/api/ml/analyze` | Yes | Trigger ML analysis on user's sessions |
| GET | `/api/ml/report` | Yes | Get latest ML analysis report |
| POST | `/api/ml/gemini-overview` | Yes | Send ML report to Gemini, get advice |
| GET | `/api/progress` | Yes | Get user progress |
| PUT | `/api/progress` | Yes | Update progress (tech, lessons, etc.) |
| POST | `/api/progress/xp` | Yes | Add XP event |
| GET | `/api/flashcards` | Yes | Get flashcards (query: ?techId=) |
| PUT | `/api/flashcards/:cardId/progress` | Yes | Update card review |
| GET | `/api/schedule` | Yes | Get user's schedule weeks |
| POST | `/api/schedule` | Yes | Create new week |
| PUT | `/api/schedule/:id` | Yes | Update week |
| DELETE | `/api/schedule/:id` | Yes | Delete week |
| GET | `/api/notes/:techId` | Yes | Get notes for tech |
| PUT | `/api/notes/:techId` | Yes | Update notes |
| GET | `/api/snippets` | Yes | Get saved code snippets |
| POST | `/api/snippets` | Yes | Save code snippet |
| DELETE | `/api/snippets/:id` | Yes | Delete snippet |
| GET | `/api/tutor/history` | Yes | Get chat history |
| POST | `/api/tutor/chat` | Yes | Send message to Gemini tutor |
| GET | `/api/achievements` | Yes | Get user's unlocked badges |
| POST | `/api/achievements/check` | Yes | Check and unlock new badges |

---

## AUTHENTICATION

- Registration: name, email, password → hash with bcrypt → save User → return JWT
- Login: email + password → verify with bcrypt → return JWT  
- JWT contains: `{ userId, email }`, expires in 7 days
- Auth middleware: Extract token from `Authorization: Bearer <token>` header, verify, attach `req.user`
- All routes except `/api/auth/register` and `/api/auth/login` require auth middleware

---

## THE GATE SYSTEM

### Logic
```javascript
// Gate appears if user.lastGateDate !== today's date string
// Gate is FREE to skip — no XP penalty
// Gate duration = user.gateDurationMinutes (default 5, options: 1/2/3/5/10)
```

### Gate Screen (GateScreen.jsx)
- Full-screen overlay that blocks ALL app routes until completed
- Elements top to bottom:
  1. CODEC logo + "Daily Training Gate" label
  2. Countdown timer: MM:SS counting down from user's chosen duration
  3. Daily mode badge: rotates on 3-day cycle (Words → Code → Sentences)
  4. Typing area with live character highlighting
  5. Live stats: WPM | Accuracy % | Characters typed | Errors
  6. SVG keyboard with finger highlights below
  7. Skip button (bottom-right, subtle) — confirmation modal on click
- Gate content matches user's current lesson level:
  - Before Level 1 complete: only `asdf jkl;` patterns
  - After Level 2: full home row words
  - After Level 5: full alphabet
  - After Level 7: symbols
  - After Level 8: code snippets
- When timer hits 00:00 or text completed: gate done, show result card 3 seconds, advance to Dashboard
- Skip: show modal "Are you sure? Typing practice builds speed. Skip anyway?" → if confirmed, mark gate done, increment skipCount

---

## 12 PAGES — SPECIFICATIONS

### ⚙️ Settings `/settings`
- Profile: edit name, avatar
- Active Technology: dropdown of 10 techs
- Gate Duration: selector 1/2/3/5/10 min
- Weekly Hour Target: number input, default 3
- Study Reminder: toggle + time picker (Browser Notification API)
- Account: change password, logout, delete account (type DELETE to confirm)
- About: app version, stack

### 🏠 Dashboard `/`
- XP + Level bar (top, always visible). Dual-colour: typing XP (neon green) vs learning XP (neon purple)
- Streak badge with animated flame
- Status Board: today's tasks checklist (gate, learning task, flashcard review, project check-in). Checkboxes award XP.
- Study Timer in TopBar — auto-runs, pauses on tab blur
- Quick Stats: 4 cards — Hours This Week, Current WPM, Tech Progress %, Sessions Today
- Study Chart: Recharts area chart, 14 days, typing + learning time stacked
- Next Action Card: Gemini-generated or static fallback
- Recent Achievements: last 3 badges

### ⌨️ Typing `/typing` — FIVE TABS
**Tab 1: Practice** — Free typing. Mode: Words/Code/Sentences. Duration: 1/3/5/10 min. Live engine + SVG keyboard. Session data → API → MongoDB.

**Tab 2: Lessons** — 8-level curriculum:

| Level | Name | Keys | WPM Target |
|-------|------|------|-----------|
| L1 | Home Row Basics | `a s d f — j k l ;` | 15 |
| L2 | Home Row Mastery | All home row + spacebar | 20 |
| L3 | Upper Row | `q w e r t — y u i o p` | 25 |
| L4 | Lower Row | `z x c v b — n m , . /` | 30 |
| L5 | Full Alphabet | All 26 letters | 35 |
| L6 | Numbers | `1-9, 0` | 38 |
| L7 | Symbols | `! @ # $ % ^ & * ( )` etc. | 40 |
| L8 | Code Mode | Real code snippets | 50 |

Each level: 4-6 lessons + level test (85%+ accuracy to unlock next). AI Bonus Drills section below (optional, 30 XP each).

**Tab 3: Stats** — WPM chart (30 sessions), accuracy chart, keyboard heatmap (SVG), finger performance bars, top 20 slowest bigrams, session history (20), personal bests.

**Tab 4: ML Analysis** — "Run Analysis" button → calls `/api/ml/analyze` → shows results. Then optional "Get AI Overview" button → calls `/api/ml/gemini-overview` → shows Gemini advice + bonus drills. Timestamp with orange badge if >7 days old.

**Tab 5: Finger Guide** — Full static SVG QWERTY keyboard colour-coded by finger. Hover tooltip on each key. Legend below.

### 🗺️ Roadmap `/roadmap`
- 3 layers: Layer 1 (Game: C++, UE5, Blender, Git, Python), Layer 2 (AI: PyTorch, RL/PPO, ZeroMQ), Layer 3 (Federation: FastAPI, FedAvg)
- Tech cards: name, emoji, layer badge, status, progress bar, hours, mini project status, resource count
- Expand to show details. Mark Active button (one at a time). Overall X/10 ring progress. Filter.

### 📚 Resources `/resources`
- Filter by tech + type (Video/Book/Course/Article). Search bar.
- Cards: title, type badge, tech badge, free badge, description, link
- YouTube embed toggle (inline iframe)
- Mark Watched/Read per resource
- ALL resources must be FREE only (YouTube, free courses, free e-books, docs)
- App starts empty — users add their own resources

### 💻 Code Playground `/code`
- Monaco Editor. Language tabs: Python | C++ | JavaScript
- Python: Pyodide in browser. JS: sandboxed iframe. C++: syntax only + note to compile locally.
- Output panel: green success, red errors
- AI Review button → Gemini. Save/Load snippets from MongoDB.

### 🃏 Flashcards `/flashcards`
- Filter by active tech. 3D CSS flip animation.
- Got It (+5 XP) / Still Learning / Hard buttons.
- Session stats. Shuffle/Reset.
- 200+ cards pre-seeded in MongoDB across 10 techs (minimum 15 per tech)

### 🤖 AI Tutor `/tutor`
- Chat UI: user right (neon blue), Gemini left (neon purple)
- Single Gemini model from server `.env`
- System prompt auto-built from: active tech, current week, total hours, XP level
- 6 suggested prompts (change by active tech)
- Code paste: mini Monaco in input
- History: last 50 messages in MongoDB

### 📅 Schedule `/schedule`
- FLEXIBLE — users create, edit, reorder, delete weekly tasks (NOT fixed 72 weeks)
- Week cards: number, tech topic, task, target hours, checkbox
- Current week highlighted, auto-scrolled. +100 XP on complete. Filter.

### 📝 Notes `/notes`
- Sidebar: 10 tech categories
- Rich text with markdown rendering
- Auto-save 500ms after typing → MongoDB
- Search, export as .md, word count

### 🔨 Mini Projects `/projects`
- 10 cards, one per tech. Name, badge, description, 3-5 sub-task checklist, status.
- All sub-tasks done → +500 XP + tech badge. Link to resources + Code Playground shortcut.
- X/10 progress at top.

### 🏆 Achievements `/achievements`
- Full gallery: locked (greyed) / unlocked (neon glow)
- 3 categories: Typing Badges (15), Learning Badges (15), CODEC Cross-System Badges (10)
- Badge detail on click. Total count X/40.

---

## XP SYSTEM

| Action | XP |
|--------|-----|
| Complete gate (no skip) | +50 |
| Skip gate | +0 |
| Voluntary typing session | +20 |
| Pass lesson (85%+) | +75 |
| Unlock new level | +200 |
| AI bonus drill | +30 |
| Break personal best WPM | +100 |
| Run ML analysis | +25 |
| WPM milestone (30/50/70/100) | +500 each |
| 7-day gate streak | +300 |
| 30-day gate streak | +1,000 |
| Complete schedule week | +100 |
| Flashcard "Got It" | +5 |
| Mini project sub-task | +50 |
| Full mini project | +500 |
| Full technology | +1,000 |
| Write 200+ words in Notes | +15 |
| Run code in playground | +3 |
| Ask AI Tutor | +2 |
| Unlock CODEC cross-badge | +250 |
| First login of the day | +10 |

### NPC Rank Levels

| Level | XP | Rank |
|-------|-----|------|
| 1 | 0 | 🤖 Dormant NPC |
| 2 | 500 | 🔵 Script Initialised |
| 3 | 1,500 | 🟢 Pattern Recognition |
| 4 | 3,500 | 🟡 Behavioural Clone |
| 5 | 7,000 | 🟠 Adaptive Fighter |
| 6 | 12,000 | 🔴 Threat Level: Elevated |
| 7 | 20,000 | ⚡ Federated Intelligence |
| 8 | 35,000 | 👾 THE FINAL BOSS |

### Streak System
- Gate completion OR 15+ min study = streak day
- Bronze: typing only | Silver: learning only | Gold: both | Diamond: 30+ day streak
- Breaking shows: "Streak broken. The NPC is recalibrating." — reset count, preserve all-time best

---

## ACHIEVEMENT BADGES (40 TOTAL)

### Typing Badges (15)
First Keystrokes (first gate) | Home Row Hero (L1 90%+) | Full Alphabet (L5) | Symbol Master (L7) | Code Typist (L8 50WPM) | Speed 30/50/70/100 | Consistent (7×90%+) | Data Scientist (ML×10) | Gate Keeper (30 gates no skip) | Marathon Typist (50 sessions) | Night Owl (gate after 11PM) | Early Bird (gate before 7AM)

### Learning Badges (15)
First Lesson (Week 1) | Tech Explorer (3 techs started) | Deep Diver (1 tech 100%) | Flashcard Rookie/Master (50/500) | Code Runner (25 runs) | Note Taker (1000 words) | Project Starter/Finisher | Halfway (5 projects) | Builder (10 projects) | Curious Mind (50 tutor Qs) | Scholar (100 hours) | Roadmap 50% | The Long Game (all 10 techs)

### CODEC Cross-System (10) — require BOTH typing + learning condition (+250 XP each)
🔥 Dual Threat (7 gates no skip + 7 weeks) | ⚡ CODEC Initiate (30WPM + 1st project) | 🎯 Precision Coder (95%+ session + 90% flashcard) | 🧠 Mind & Fingers (L5 + Python done) | 💻 Developer DNA (50WPM + 3 projects) | 🤖 NPC Awakened (all 8 levels + 5 techs) | ⚙️ Machine Learning (ML×20 + PyTorch done) | 🏋️ Grinder (100 sessions + 200 hours) | 🌟 All-Rounder (70WPM + all 10 techs started) | 👾 THE CODEC (80WPM + all 8 levels + all 10 techs + all projects)

---

## ML PIPELINE

### Data Flow (NO file downloads)
1. Typing session ends → keypress data sent to Express API → saved to MongoDB
2. User clicks "Run Analysis" → Express calls Python ML script → passes session data from MongoDB as JSON via stdin
3. Python trains 3 models → returns analysis_report JSON via stdout
4. Express saves report to MongoDB → returns to frontend
5. User optionally clicks "Get AI Overview" → Express sends report to Gemini → saves + returns advice

### Three Models in `ml/codec_typing_ml.py`

**Model 1 — Weak Key Classifier (Random Forest)**
Features: avg_latency_ms, error_rate, avg_hold_duration_ms, backspace_rate, session_count per key.
Labels: Strong / Average / Weak.
Output: ranked weak keys with per-key stats.

**Model 2 — WPM Growth Predictor (Polynomial Regression degree=2)**
Features: session number, cumulative practice time, days elapsed.
Output: current WPM, predicted WPM at 30/60/90 sessions, days to 60 WPM.

**Model 3 — Typing Fingerprint (K-Means, K=4)**
Features: inter-key latency sequences, bigram latency matrix.
Clusters: Burst Typist, Steady Rhythm, Hesitant Typist, Fatiguing Typist.
Output: profile name, top 20 slowest bigrams, fatigue onset time.

### `ml/requirements.txt`
```
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
```

### Express ML Bridge (`server/services/mlBridge.js`)
```javascript
// Spawns Python process, passes session data via stdin, reads analysis from stdout
const { spawn } = require('child_process');

const runMlAnalysis = (sessionData) => {
  return new Promise((resolve, reject) => {
    const py = spawn('python', ['ml/codec_typing_ml.py']);
    let output = '';
    py.stdin.write(JSON.stringify(sessionData));
    py.stdin.end();
    py.stdout.on('data', (data) => output += data.toString());
    py.stderr.on('data', (data) => console.error(data.toString()));
    py.on('close', (code) => {
      if (code === 0) resolve(JSON.parse(output));
      else reject(new Error(`ML script exited with code ${code}`));
    });
  });
};
```

---

## GEMINI INTEGRATION

Single Gemini model. API key in server `.env`. Two use cases with different prompts:

### Use 1: Typing ML Overview (user-triggered after viewing ML results)
```javascript
// server/services/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const getTypingAdvice = async (analysisReport, userState) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `You are a typing coach. Analyze this ML report and return ONLY valid JSON:
    ${JSON.stringify(analysisReport)}
    User WPM: ${userState.wpm}, Goal: 70+ WPM
    Return: { summary, improvements: [{priority,action,reason}×3], bonus_drills: [{id,title,description,duration_secs,target}×3], motivation }`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};
```

### Use 2: AI Tutor Chat
```javascript
const chatWithTutor = async (messages, userState) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const systemPrompt = `You are the AI Tutor inside CODEC — a personal learning app.
    Student's active tech: ${userState.activeTech}
    Current study hours: ${userState.totalHours}
    XP Level: ${userState.level} (${userState.rank})
    Rules: Connect to their learning context. Be specific. Keep under 400 words.`;
  const chat = model.startChat({ history: messages, systemInstruction: systemPrompt });
  const result = await chat.sendMessage(messages.at(-1).content);
  return result.response.text();
};
```

---

## DESIGN SYSTEM — "Cyberpunk Command Center"

### Tailwind Config
```javascript
// client/tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#0A0E1A',
        'bg-card':      '#111827',
        'bg-elevated':  '#1A2035',
        'neon-cyan':    '#00F5D4',
        'neon-magenta': '#F72585',
        'neon-blue':    '#4361EE',
        'neon-gold':    '#FFD60A',
        'neon-orange':  '#FF6B35',
        'neon-purple':  '#7B2FF7',
        'border-dim':   '#1E293B',
      },
      boxShadow: {
        'neon':        '0 0 10px #00F5D4, 0 0 20px #00F5D450',
        'neon-purple': '0 0 10px #7B2FF7, 0 0 20px #7B2FF750',
        'neon-gold':   '0 0 10px #FFD60A, 0 0 20px #FFD60A50',
        'neon-pink':   '0 0 10px #F72585, 0 0 20px #F7258550',
      },
      fontFamily: {
        'heading': ['Bricolage Grotesque', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'accent': ['Orbitron', 'sans-serif'],
      },
    },
  },
};
```

### index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@500;700&display=swap');

body {
  background-color: #0A0E1A;
  color: #E2E8F0;
  font-family: 'Inter', sans-serif;
}

@keyframes pulse-neon {
  0%, 100% { box-shadow: 0 0 5px #00F5D4, 0 0 10px #00F5D450; }
  50%      { box-shadow: 0 0 20px #00F5D4, 0 0 40px #00F5D480; }
}

@keyframes glow {
  from { text-shadow: 0 0 5px #00F5D4; }
  to   { text-shadow: 0 0 20px #00F5D4, 0 0 40px #00F5D480; }
}

.neon-card {
  background: #111827;
  border: 1px solid #1E293B;
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.neon-card:hover {
  border-color: #00F5D4;
  box-shadow: 0 0 15px #00F5D430;
}
```

### React Bits Animations — Where to Use
Get these components from https://reactbits.dev/ (copy/paste into your project):
- **Splash Screen**: `Aurora` background + `ShuffleText` for logo
- **Page Transitions**: `FadeContent`
- **Achievement Unlock**: `Confetti` + `Spotlight`
- **XP Gain**: `CountUp` animated numbers
- **Streak Fire**: `Sparkles` particles
- **Card Hovers**: `TiltCard`
- **Loading States**: `RotatingText`
- **Gate Timer**: `GradientText`
- **Errors/Streak Break**: `GlitchText`
- **Background**: `Particles` (subtle, low opacity)

### Design Rules
1. NEVER white backgrounds — use `bg-primary` (#0A0E1A) or `bg-card` (#111827)
2. Neon = accent only — text glow, borders, not backgrounds
3. Cards glow on hover — border transitions to neon + faint box-shadow
4. Interactive elements pulse — buttons, active states, timers
5. Numbers animate — XP counters, stat cards, progress bars fill smoothly
6. Every component must look premium — no plain/default HTML styling

---

## SVG KEYBOARD — FINGER MAPPING

The keyboard is a real SVG — NOT CSS grid, NOT an image. Each key = `<rect>` + `<text>`.

| Finger | Keys | Colour |
|--------|------|--------|
| Left Pinky | Q, A, Z, 1, Tab, Caps, Shift | `#7B2FF7` purple |
| Left Ring | W, S, X, 2 | `#4361EE` blue |
| Left Middle | E, D, C, 3 | `#00F5D4` cyan |
| Left Index | R, F, V, T, G, B, 4, 5 | `#FFD60A` gold |
| Right Index | Y, H, N, U, J, M, 6, 7 | `#FF6B35` orange |
| Right Middle | I, K, 8, , | `#00F5D4` cyan |
| Right Ring | O, L, 9, . | `#4361EE` blue |
| Right Pinky | P, ;, /, 0, [, ], ', Enter, Backspace | `#7B2FF7` purple |
| Both Thumbs | Spacebar | `#E2E8F0` white |

During typing: next key glows with finger colour + `scale(1.1)` + label: "USE: Left Index Finger"

---

## FLASHCARD SEED DATA

Generate 200+ flashcards in `server/seeds/flashcards.js`. Run with `node server/seeds/flashcards.js` to populate MongoDB.

| Tech | Count | Topics |
|------|-------|--------|
| Python | 20 | Variables, lists, dicts, classes, OOP, JSON, pip, virtualenvs, lambda, comprehension, errors, f-strings, modules, decorators, generators, context managers, itertools, type hints, dataclasses, async |
| C++ | 25 | Pointers, references, classes, inheritance, memory, smart pointers, templates, vectors, const, headers, compilation, namespaces, STL, overloading, RAII, move semantics, virtual, abstract, polymorphism, lambdas, auto, range-for, constexpr, structured bindings, enum class |
| Git | 12 | Commit, branch, merge, push, pull, clone, diff, stash, rebase, conflicts, cherry-pick, bisect |
| UE5 | 25 | ACharacter, APawn, AActor, GameMode, Blueprint vs C++, Enhanced Input, UMG, AnimBP, Collision, LineTrace, UPROPERTY, UFUNCTION, GAS, NavMesh, tick, components, delegates, interfaces, subsystems, widgets, materials, particles, level streaming, replication, TSubclassOf |
| Blender | 15 | Mesh, armature, UV, material, modifier, FBX, rigging, weight paint, keyframe, IK, shading, render, normals, topology, LOD |
| PyTorch | 25 | Tensor, nn.Module, Linear, ReLU, forward, loss, optimizer, Adam, backprop, gradient, batch, epoch, overfit, regularization, GPU, DataLoader, autograd, save, transforms, CNN, LSTM, attention, embedding, dropout, batch norm |
| RL/PPO | 30 | Agent, environment, state, action, reward, policy, value, Q-value, Bellman, exploration, PPO, clipped, actor-critic, entropy, GAE, on/off-policy, DQN, episode, trajectory, discount, advantage, baseline, REINFORCE, replay, target network, TD, multi-agent, self-play, curriculum, reward shaping |
| ZeroMQ | 12 | Socket, REQ-REP, PUB-SUB, PUSH-PULL, bind, connect, JSON, framing, async, context, inproc, multipart |
| FastAPI | 18 | Route, endpoint, Pydantic, GET, POST, PUT, DELETE, HTTP, JSON, uvicorn, async, DI, status codes, CORS, middleware, query params, response model, OAuth2 |
| FedLearn | 20 | FedAvg, weight avg, client, server, comm round, non-IID, privacy, diff privacy, gradient compression, aggregation, local epochs, global model, convergence, client drift, secure aggregation, optimization, heterogeneity, personalization, cross-device, cross-silo |

Each card format:
```javascript
{ id: 'py-001', techId: 'python', front: '...', back: '...', difficulty: 'easy|medium|hard' }
```

---

## ONBOARDING FLOW (First-time user)

1. After registration → Welcome screen: CODEC logo + "Welcome, Trainee NPC. Let's set you up." → Begin Setup button
2. 3 questions: typing speed estimate (beginner/intermediate/advanced), starting technology (dropdown), weekly hours (number)
3. Profile set: XP=0, Level 1, "Dormant NPC", active tech from survey
4. Tutorial overlay: 60-second highlights of Gate, Dashboard, Typing, Learning
5. First gate → then Dashboard

---

## CRITICAL RULES

1. **Start empty**: The app has ZERO mock data except the 200+ flashcards. Users create their own schedule weeks, add their own resources, write their own notes. Technologies are defined in the roadmap structure (10 hardcoded techs with names/emojis/layers) but all user progress starts at 0.

2. **No file downloads**: Typing session data goes to MongoDB via API. ML model reads from MongoDB. No JSON files are downloaded to the user's machine.

3. **ML is user-triggered**: ML analysis only runs when user clicks "Run Analysis". Gemini overview only runs when user clicks "Get AI Overview" AFTER viewing ML results.

4. **Single Gemini model**: One API key in server `.env`. Both typing analysis and tutor use the same key. No client-side API key management.

5. **Gate starts from basics**: Before Level 1 is complete, gate content is only `asdf jkl;` patterns. Content progressively includes more keys as levels are completed.

6. **Every component must look premium**: Use the cyberpunk theme. Neon accents, dark backgrounds, smooth animations, glowing cards. Get animations from reactbits.dev. If it looks plain, it's wrong.

7. **Comment every hook and utility**: Every custom hook, store, and utility function must have a JSDoc comment explaining what it does and why.
