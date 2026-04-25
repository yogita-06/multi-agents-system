<div align="center">

# 🔬 ResearchAI — Multi-Agent Research Assistant

<p align="center">
  <strong>3 AI agents collaborate to generate professional research reports instantly</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Groq-LLaMA--3.3--70B-F55036?style=for-the-badge&logo=meta&logoColor=white" alt="Groq" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/PRs-Welcome-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat-square" />
</p>

</div>

---

## ✨ Features

- **Multi-Agent Pipeline** — Three specialized AI agents work sequentially: Researcher → Analyst → Writer
- **Real-Time Progress** — Watch each agent light up live as it completes its task
- **Server-Sent Events (SSE)** — Zero-polling, push-based updates streamed directly from the server
- **PDF Export** — Download a beautifully formatted PDF report with one click (powered by Puppeteer)
- **Research History Sidebar** — Last 5 searches saved to localStorage, click to reload any report instantly
- **Dark Futuristic UI** — Deep black + purple + electric cyan glassmorphism design
- **Animated Agent Cards** — Per-agent glow effects, shimmer bars, and status badges (Waiting → Processing → Complete)
- **Staged Progress Bar** — 33% → 66% → 100% with a gradient fill and glowing leading dot
- **Expandable Report Sections** — 5 collapsible sections with per-section copy buttons
- **Share & Export** — Copy full report to clipboard or download as PDF
- **Dark / Light Mode** — Full theme toggle persisted across interactions
- **Mobile Responsive** — Stacked layout on small screens with step indicators

---

## 🤖 How It Works

ResearchAI uses a **sequential multi-agent architecture**. Each agent receives the previous agent's output as context, building a progressively richer understanding of the topic.

```
┌─────────────┐
│  User Input │  "Enter any research topic"
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                        AGENT PIPELINE                            │
│                                                                  │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │  🔍 Agent 1     │      │  🧠 Agent 2     │                   │
│  │  RESEARCHER     │─────▶│  ANALYST        │                   │
│  │                 │      │                 │                   │
│  │ • Key aspects   │      │ • Key patterns  │                   │
│  │ • Recent devs   │      │ • Insights      │                   │
│  │ • Statistics    │      │ • Comparisons   │                   │
│  │ • Challenges    │      │ • Significance  │                   │
│  └─────────────────┘      └────────┬────────┘                   │
│                                    │                             │
│                                    ▼                             │
│                           ┌─────────────────┐                   │
│                           │  ✍️  Agent 3    │                   │
│                           │  WRITER         │                   │
│                           │                 │                   │
│                           │ • Exec Summary  │                   │
│                           │ • Key Findings  │                   │
│                           │ • Analysis      │                   │
│                           │ • Conclusion    │                   │
│                           │ • Recommen...   │                   │
│                           └────────┬────────┘                   │
└────────────────────────────────────┼─────────────────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  📄 PDF Report  │
                            │  + UI Display   │
                            └─────────────────┘
```

### Agent Roles

| Agent | Role | Input | Output |
|-------|------|-------|--------|
| 🔍 **Researcher** | Gathers raw information on the topic | User's topic | 5 key aspects, statistics, challenges, recent developments |
| 🧠 **Analyst** | Processes and structures the raw research | Research findings | Patterns, insights, comparisons, significance rankings |
| ✍️ **Writer** | Writes the final professional report | Research + Analysis | Structured JSON report with 5 sections |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks-based state management |
| **Vite 5** | Lightning-fast dev server and build tool |
| **Tailwind CSS 3** | Utility-first styling with custom animations |
| **Lucide React** | Clean, consistent icon set |
| **Axios** | HTTP client for PDF export requests |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js 4** | HTTP server and routing |
| **Server-Sent Events** | Real-time one-way push from server to browser |
| **CORS + dotenv** | Security and environment management |

### AI & Export
| Technology | Purpose |
|------------|---------|
| **Groq API** | Ultra-fast LLM inference |
| **LLaMA-3.3-70B** | State-of-the-art open-source model |
| **Puppeteer 21** | Headless Chrome for PDF generation |
| **UUID** | Unique IDs for each research session |

---

## 📁 Project Structure

```
muti-agents-system/
│
├── 📂 server/                      # Node.js + Express backend
│   ├── 📂 routes/
│   │   └── research.js             # SSE /stream + POST /export-pdf
│   ├── agents.js                   # 3 Groq agent functions
│   ├── index.js                    # Express app entry point
│   ├── .env                        # Environment variables (git-ignored)
│   ├── .env.example                # Template for .env
│   └── package.json
│
├── 📂 client/                      # React + Vite frontend
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── Navbar.jsx          # Top bar: logo, history, dark mode
│   │   │   ├── SearchBar.jsx       # Hero search with typewriter effect
│   │   │   ├── AgentPipeline.jsx   # 3-card layout with connectors
│   │   │   ├── AgentCard.jsx       # Individual agent card with glow
│   │   │   ├── ReportDisplay.jsx   # 5-section report with actions
│   │   │   ├── Sidebar.jsx         # Research history panel
│   │   │   └── ProgressBar.jsx     # Gradient progress with glow dot
│   │   ├── App.jsx                 # Root: state machine + SSE client
│   │   ├── index.css               # Tailwind + custom animations
│   │   └── main.jsx                # React entry point
│   ├── index.html                  # App shell + font imports
│   ├── tailwind.config.js          # Custom colors, keyframes, animations
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- A free **Groq API key** — [Get one here](https://console.groq.com)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yogita-06/muti-agents-system.git
cd muti-agents-system
```

**2. Install server dependencies**

```bash
cd server
npm install
```

> Note: This installs Puppeteer which downloads a bundled Chromium binary (~200 MB). This is required for PDF export.

**3. Install client dependencies**

```bash
cd ../client
npm install
```

### Environment Variables

**4. Configure your API key**

```bash
# In the server/ directory, copy the example file:
cp .env.example .env
```

Then open `server/.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

#### How to get a free Groq API key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key and paste it into `server/.env`

> Groq's free tier is very generous — LLaMA-3.3-70B is available with high rate limits at no cost.

### Run the Application

Open **two terminal windows**:

**Terminal 1 — Start the backend server:**

```bash
cd server
npm run dev
```

You should see:
```
🚀 ResearchAI Server running on http://localhost:3001
📡 SSE endpoint: http://localhost:3001/api/research/stream?topic=<topic>
📄 PDF export:   http://localhost:3001/api/research/export-pdf
```

**Terminal 2 — Start the frontend:**

```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**Open your browser and visit: [http://localhost:5173](http://localhost:5173)**

---

## 🔑 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GROQ_API_KEY` | Your Groq API key for LLM access | ✅ Yes | — |
| `PORT` | Port the Express server listens on | ❌ No | `3001` |

---

## 🎯 Use Cases

ResearchAI is built for anyone who needs fast, structured intelligence on any topic:

| Use Case | Example Topic |
|----------|--------------|
| 📊 **Business Research** | "SaaS pricing strategies in 2024" |
| 🎓 **Academic Research** | "CRISPR gene editing ethical implications" |
| 📈 **Market Analysis** | "Electric vehicle market trends and competitors" |
| 🔍 **Competitive Intelligence** | "Notion vs Linear vs Jira for product teams" |
| ✍️ **Content Creation** | "The future of remote work post-pandemic" |
| 🌍 **Policy & Society** | "Universal Basic Income — global experiments" |
| 💊 **Healthcare** | "AI diagnostics in radiology — current state" |
| ⚡ **Technology Trends** | "Quantum computing practical applications 2025" |

---

## 📸 Screenshots

> Screenshots will be added here. To preview the app locally, follow the [Getting Started](#-getting-started) steps above.

| View | Description |
|------|-------------|
| 🏠 **Home** | Hero search bar with animated typewriter placeholder |
| ⚡ **Processing** | 3 glowing agent cards with live SSE progress |
| 📄 **Report** | Expandable 5-section report with copy & PDF buttons |
| 📜 **History** | Sidebar with last 5 research sessions |

---

## 🛠️ Customization

### Modify Agent Prompts

All three agent system prompts are in `server/agents.js`. Each is a plain string — edit them to change tone, output format, or expertise area:

```js
// server/agents.js

// Change the Researcher to focus on academic sources:
content: `You are an academic researcher specializing in peer-reviewed literature...`

// Make the Writer use a more casual tone:
content: `You are a journalist. Write in a clear, engaging style...`
```

### Add a Fourth Agent

1. Create a new export in `server/agents.js`:

```js
export const factCheckerAgent = async (topic, report) => {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: `You are an expert fact-checker...` },
      { role: 'user',   content: `Verify this report on "${topic}":\n${JSON.stringify(report)}` },
    ],
    model: MODEL,
    max_tokens: 1000,
  });
  return completion.choices[0]?.message?.content || '';
};
```

2. Call it in `server/routes/research.js` after Agent 3 and emit the corresponding SSE events.

3. Add a fourth card to `INITIAL_AGENTS` in `client/src/App.jsx`:

```js
{ id: 4, name: 'Fact Checker', icon: '✅', status: 'waiting', preview: null, color: 'green' }
```

### Change the Report Format

The Writer agent returns JSON. To add new sections, update its system prompt in `agents.js` to include new keys, then add a new entry to the `SECTIONS` array in `client/src/components/ReportDisplay.jsx`:

```js
{
  key: 'futureOutlook',
  label: 'Future Outlook',
  icon: TrendingUp,        // from lucide-react
  color: 'violet',
  accent: '#8B5CF6',
  light: 'rgba(139,92,246,0.1)',
  badge: 'text-violet-300',
},
```

### Change the AI Model

In `server/agents.js`, update the `MODEL` constant:

```js
// Current (best quality + speed balance):
const MODEL = 'llama-3.3-70b-versatile';

// Faster / lighter:
const MODEL = 'llama-3.1-8b-instant';

// Most capable:
const MODEL = 'llama-3.3-70b-specdec';
```

Browse all available models at [console.groq.com/docs/models](https://console.groq.com/docs/models).

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure your code follows the existing style and all endpoints are tested before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see below for details.

```
MIT License

Copyright (c) 2024 Yogita Jha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙋‍♀️ Author

<div align="center">

**Yogita Jha**

[![GitHub](https://img.shields.io/badge/GitHub-yogita--06-181717?style=for-the-badge&logo=github)](https://github.com/yogita-06)
[![Email](https://img.shields.io/badge/Email-jhayogita06%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jhayogita06@gmail.com)

*Built with passion for AI, great design, and open source.*

</div>

---

<div align="center">

**⭐ If you found this project useful, please give it a star! It helps others discover it.**

Made with ❤️ by [Yogita Jha](https://github.com/yogita-06)

</div>
