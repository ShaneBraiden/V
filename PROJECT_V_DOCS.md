# Project V: System Architecture & Roadmap

## 🚀 Overview
**V** (formerly CODEC) is a high-performance, gamified learning platform for developers and digital artists. It combines interactive curriculum hub with real-time AI feedback and machine-learning-driven diagnostics.

---

## 🏗️ Technical Architecture

### Frontend (Modern SPA)
- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Atomic, lightweight state)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a custom **Neo-Brutalist** design system.
- **Interactions:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) for in-browser IDE experience and [Framer Motion](https://www.framer.com/motion/) for micro-animations.
- **Data Visualization:** [Recharts](https://recharts.org/) for progress analytics.

### Backend (Robust API)
- **Core:** [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) for flexible schema management (Tech Progress Maps, User Profiles).
- **Authentication:** [JWT](https://jwt.io/) (JSON Web Tokens) with [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing.
- **AI Engine:** Integrated [Google Gemini Pro](https://deepmind.google/technologies/gemini/) for real-time code reviews and tutoring.
- **Code Execution:** Utilizing [Piston API](https://github.com/engineer-man/piston) for secure, sandboxed C++ and multi-language execution.

---

## 🎨 Design Philosophy: "Premium Brutalism"
The UI follows a strict **Neo-Brutalist** aesthetic characterized by:
- High-contrast color palettes (Vibrant Purples, Mints, and Yellows).
- Hard-edged borders (2px brutal-black) and solid drop shadows.
- Geometric rigidity paired with premium "Ghost Fade" transitions in Dark Mode.
- Custom **Pixelify Sans** typography for header elements.

---

## 🛠️ Core Features

- **Unified Learn Hub:** Categorized learning paths across 10+ technologies (UE5, Blender, Python, etc.).
- **ML Typing Trainer:** Analyzes keystroke dynamics to provide detailed analysis on typing ergonomics and speed.
- **AI Tutor & Code Review:** Direct AI feedback on challenge solutions and conceptual questions.
- **Progression System:** XP-based leveling, Daily Streaks, and Rank progression (from Novice to Grandmaster).
- **Code Playground:** A sandboxed environment to test snippets across different languages.

---

## 🔮 Future Integration & Scale

### 1. Advanced Media Storage
- Replacement of local/limited storage with a **Google Drive Proxy** via Firebase Cloud Functions.
- Direct video streaming from Drive using ExoPlayer (for mobile) and custom web players.

### 2. Mobile Ecosystem
- **V-Mobile:** A companion Android app focusing on theory content, achievement tracking, and remote tutoring.

### 3. Community Features
- **Project Showcases:** A peer-review system where users can display their Blender renders or C++ projects.
- **Collaborative Challenges:** Multiplayer coding sessions and typing races.

### 4. Enterprise Integration
- White-label capabilities for corporate training labs.
- Federated Learning modules for secure, decentralised ML training education.
