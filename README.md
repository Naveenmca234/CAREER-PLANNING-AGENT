# 🚀 Career Planning Agent

An AI-powered web application built with **Agentic AI** and **Prompt Engineering** techniques that helps students evaluate academic qualifications, identify skill gaps, and generate personalized, phased learning roadmaps with practical projects and curated resources.

---

## 🌟 Key Features

1. **Agentic Student Profile Analysis**
   - Assesses academic standing, current skill proficiencies, and career feasibility.
   - Calculates realistic timelines based strictly on the student's available daily hours.

2. **3 Tailored Career Path Recommendations**
   - Recommends the 3 most suitable career paths with fit percentages, market demand, salary ranges, and target job titles.

3. **Skills Inventory & Gap Matrix**
   - **Existing Skills:** Categorized into Programming, Data/Databases, Web Engineering, and DevOps with relevance mappings.
   - **Skill Gaps:** Prioritized into *Critical*, *High*, and *Medium* priorities with actionable bridging strategies.

4. **Personalized Milestone Roadmap (Weekly & Monthly Stages)**
   - Phased progression (e.g., Fundamentals → Core ML/Engineering → Deep Learning → RAG/LLMs → Production Deployment & Placement Sprint).
   - Checkable milestones with dynamic completion progress tracking.

5. **Curated Resources & High-Impact Projects**
   - Free and top-rated certifications (Coursera, DeepLearning.AI, Harvard CS50, freeCodeCamp).
   - Sequential portfolio projects (Beginner → Intermediate → Capstone) complete with tech stacks and quantifiable resume bullet points.

6. **Interactive Agentic Refinement & Chat**
   - Iterative counselor allowing students to ask follow-up questions, change timelines (e.g. *"Accelerate to 3 months"*), or pivot to specialized domains.
   - Dynamically recomputes and updates the roadmap.

7. **Export & Print Ready**
   - 1-click Markdown export (`.md`) and styled print-ready layout for saving directly to PDF.

---

## 🛠️ Technology Stack & Architecture

- **Backend:** Node.js, Express.js REST API
- **AI Integration:** Google Generative AI (`@google/generative-ai` with Gemini 1.5 Flash / Pro) + OpenAI-compatible endpoints
- **Fallback Engine:** Built-in heuristic expert reasoning engine ensuring zero downtime even without an external API key or in offline scenarios
- **Frontend:** Modern Semantic HTML5, Vanilla CSS3 (Custom Glassmorphism design system, dark/light theme toggle, responsive layout), Vanilla ES6+ JavaScript

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```
> *Note: If no API key is provided, the application runs on the built-in Expert Rule-Based Engine. You can also add or change your Gemini API key directly from the in-app Settings modal.*

### 3. Start the Server
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🧪 Testing Example (Preset Included)

Click the preset button **"Testing Example: MCA Student → AI Engineer"** in the top bar to instantly test with:
- **Academic Qualification:** MCA student
- **Technical Skills:** Python, Java, SQL, HTML, CSS
- **Interests:** Artificial Intelligence and Software Development
- **Career Goal:** AI Engineer
- **Experience Level:** Beginner
- **Available Learning Time:** 2 hours per day
