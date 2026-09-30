# 🎯 QuizForge

> **Challenge Your Mind. Level Up Your Knowledge.**

QuizForge is a modern, interactive quiz platform that combines traditional knowledge assessment with an engaging gamified experience.

The platform provides quizzes across **Gaming, Academic, Aptitude, AI Tools, General Knowledge, and Coding**.

Its key differentiator is the **Gaming Quiz Mode**, where users receive lives and a randomly awarded lifeline through an interactive Spin Wheel, turning a conventional quiz into a strategic mini-game.

---

## ✨ Features

### 📚 Quiz Categories

| Category             | Topics                                                |
| -------------------- | ----------------------------------------------------- |
| 🎮 Gaming            | GitHub, AWS, Cybersecurity                            |
| 📚 Academic          | Data Structures, Operating Systems, Computer Networks |
| 🧠 Aptitude          | MPSC, UPSC, NEET                                      |
| 🤖 AI Tools          | ChatGPT, Gemini, DeepSeek                             |
| 🌍 General Knowledge | Indian GK, World GK, Current Affairs                  |
| 💻 Coding            | C++, Python, Java                                     |

---

## 🎮 Gaming Quiz Mode

Gaming introduces a special gameplay system.

### 🎡 Spin the Wheel

Before a Gaming quiz, the user gets **one spin**. The wheel randomly awards one lifeline:

* 💡 **Hint** — Provides a useful hint for the current question.
* **50/50** — Removes two incorrect options.
* ⏭️ **Skip** — Consumes the question without losing a life or counting it as wrong.
* ❤️ **+1 Life** — Adds one additional life.

The wheel can only be spun once per quiz.

### ❤️ Life System

Every Gaming quiz starts with **3 lives**.

A wrong answer removes one life. If **+1 Life** is awarded, the player starts with 4 lives.

The quiz ends immediately when all lives are lost.

### ⏱️ Timer

Every quiz has a maximum duration of **30 minutes**. The timer automatically submits the quiz when it reaches zero.

---

## 📝 Standard Quiz Mode

For Academic, Aptitude, AI Tools, General Knowledge, and Coding:

* 20 questions
* 30-minute timer
* Multiple-choice questions
* Previous/Next navigation
* Answer selection and modification
* Manual submission
* Automatic submission when the timer expires
* Score calculation
* Correct/wrong/skipped statistics
* Detailed question review
* Explanations

---

## 📊 Results & Performance

Results include:

* 🎯 Score
* 📈 Percentage
* ✅ Correct answers
* ❌ Wrong answers
* ⏭️ Skipped questions
* ⏱️ Time used
* 📝 Question-by-question review
* 💡 Explanations

Gaming results also indicate whether the quiz ended because all lives were lost.

---

## 📜 Quiz History

Quiz attempts are stored locally and can be reviewed later.

History includes:

* Category
* Topic
* Date
* Score
* Percentage
* Correct answers
* Wrong answers
* Skipped questions
* Completion status

---

## 🔐 Demo Authentication

QuizForge includes lightweight demo authentication. It does not require a backend authentication service.

Login state is maintained using browser storage for hackathon/demo purposes.

> **Note:** This authentication system is intended for demonstration purposes and should be replaced with secure authentication before production deployment.

---

# 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite

### UI & Styling

* Tailwind CSS
* Responsive design
* Glassmorphism-inspired UI
* Custom animations and transitions

### Icons

* Lucide React

### Data & State

* React state management
* Browser `localStorage`
* Local question bank

### Development

* Node.js
* npm
* Vite

---

# 📁 Project Structure

```text
QuizForge/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── hooks/
│   ├── routes/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

> The exact structure may vary depending on the current implementation.

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js
* npm
* A modern web browser
* Git (optional)

Verify installation:

```bash
node --version
npm --version
```

## Installation

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd QuizForge
```

If you received a ZIP file, extract it and open the extracted project folder in your terminal.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Vite will display a local address similar to:

```text
http://localhost:5173/
```

Open that address in your browser.

---

# 🎮 How to Use

### Normal categories

```text
Sign In
  ↓
Home
  ↓
Category
  ↓
Topic
  ↓
Rules
  ↓
Start Quiz
  ↓
20 Questions / 30 Minutes
  ↓
Submit or Timer Ends
  ↓
Result
```

### Gaming

```text
Sign In
  ↓
Home
  ↓
Gaming
  ↓
Topic
  ↓
Spin the Wheel
  ↓
Win Lifeline
  ↓
Rules
  ↓
Start Quiz
  ↓
3 Lives / 30 Minutes
  ↓
Use Lifeline
  ↓
Result
```

---

# 🎯 Quiz Rules

### Standard Quiz

* Maximum of 20 questions
* 30-minute timer
* One correct answer per question
* Answers can be changed before submission
* Users may submit at any time
* Timer automatically submits the quiz

### Gaming Quiz

* Maximum of 20 questions
* 30-minute timer
* Starts with 3 lives
* One Spin Wheel attempt
* One lifeline awarded
* Wrong answers reduce lives
* +1 Life can increase the total to 4 lives
* Skip does not reduce lives
* Skip is not counted as wrong or unanswered
* Quiz ends immediately when all lives are lost

---

# 🧠 Question System

QuizForge uses a locally maintained question bank.

Each question contains information such as:

```text
Question
Options
Correct Answer
Explanation
Hint
Category
Topic
```

Using a local question bank provides:

* No dependency on external AI APIs
* Fast loading
* Reliable hackathon demonstrations
* Predictable quiz behavior
* Easy question management

The architecture can later be extended to support dynamically generated questions or a backend question database.

---

# 💾 Data Storage

The current demo version uses **localStorage** for client-side persistence.

Stored information may include:

* Login state
* Quiz attempts
* Quiz history
* Results
* Demo user state

Because data is stored locally, it is not shared between different devices or browsers.

---

# 🧪 Testing

### Standard Quiz

```text
Sign In
→ Home
→ Category
→ Topic
→ Rules
→ Start Quiz
→ Answer Questions
→ Submit
→ Result
```

### Gaming Quiz

```text
Sign In
→ Home
→ Gaming
→ Topic
→ Spin Wheel
→ Receive Lifeline
→ Rules
→ Start Quiz
→ Use Lifeline
→ Answer Questions
→ Result
```

### Game Over

```text
Gaming Quiz
→ Lose Life
→ Lose Life
→ Lose Life
→ Game Over
→ Continue to Results
```

### Timer

```text
Start Quiz
→ Timer Countdown
→ Timer Reaches 00:00
→ Automatic Submission
→ Result
```

---

# 📱 Responsive Design

QuizForge is designed for:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 Tablet

The interface adapts navigation, quiz cards, question options, result statistics, and gaming controls according to screen size.

---

# 🏗️ Architecture Overview

```text
                    QuizForge
                       │
              ┌────────┴────────┐
              │                 │
          Navigation          Quiz Data
              │                 │
       ┌──────┴──────┐          │
       │             │          │
   Categories      History      │
       │                        │
     Topics                     │
       │                        │
    ┌──┴───────────────┐        │
    │                  │        │
Standard Quiz     Gaming Quiz   │
    │                  │        │
20 Questions      Spin Wheel    │
30 Minutes        Lifeline     │
    │               Lives       │
    └──────────┬───────────────┘
               │
            Results
               │
         Quiz History
```

---

# 🔮 Future Enhancements

Potential future improvements include:

* 🔐 Real user authentication
* ☁️ Cloud database
* 👤 User profiles
* 🏆 Global leaderboard
* 🥇 Achievements and badges
* 📊 Advanced performance analytics
* 🤖 AI-generated questions
* 🧑‍💼 Admin dashboard
* 📝 Question management system
* 🌐 Multiplayer quizzes
* 🎮 Additional gaming modes
* 🔔 Notifications
* 🌙 Theme customization
* 📈 Long-term learning analytics

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit:

```bash
git commit -m "Add your feature"
```

5. Push:

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---

# 📄 License

This project is currently intended for educational, demonstration, and hackathon purposes.

If released publicly, add an appropriate open-source license such as the MIT License.

---

# 👨‍💻 Project

**QuizForge**

> Challenge Your Mind. Level Up Your Knowledge.

Built as a hackathon project to explore how traditional quizzes can be enhanced through gamification and interactive learning experiences.

---

## ⭐ Why QuizForge?

Traditional quiz platforms generally follow:

```text
Question
   ↓
Answer
   ↓
Next Question
   ↓
Result
```

QuizForge introduces a different approach for Gaming:

```text
Question
   ↓
Strategy
   ↓
Spin Wheel
   ↓
Lifeline
   ↓
Lives
   ↓
Decision Making
   ↓
Result
```

The goal is not only to test what users know, but also to make learning and assessment **more engaging, strategic, and fun**.

---

**QuizForge — Challenge Your Mind. Level Up Your Knowledge. 🎯**
