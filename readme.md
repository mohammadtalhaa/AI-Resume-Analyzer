# AI Resume Analyzer (LLM + RAG)

An intelligent, front‑end resume analysis tool that simulates an **LLM + RAG (Retrieval-Augmented Generation)** pipeline to evaluate resumes against job descriptions. It extracts keywords, matches skills, identifies strengths and gaps, and provides actionable insights—all without external API calls.

🔗 **Live Demo:** [https://mohammadtalhaa.github.io/AI-Resume-Analyzer/](https://mohammadtalhaa.github.io/AI-Resume-Analyzer/)

---

## ✨ Features

- **Resume & Job Description Input** – Paste text or upload a PDF (parsed using PDF.js).
- **Keyword Extraction** – Automatically extracts meaningful keywords from both texts.
- **Skill Matching** – Compares skills from a built‑in knowledge base against the resume and job description.
- **Score Dashboard** – Visual breakdown of overall match, skills match, experience, and education scores.
- **Strengths & Gaps Analysis** – Lists matched skills, missing qualifications, and improvement suggestions.
- **RAG‑Enhanced Insights** – Provides tailored tips, industry trends, quick wins, and recommendations based on the job context.
- **Completely Local** – No data is sent to any server; all processing happens in your browser.
- **Responsive Design** – Works on desktop, tablet, and mobile.

---

## 🧠 How It Works

The tool simulates an LLM + RAG pipeline through the following steps:

1. **Resume Parsing** – If a PDF is uploaded, it extracts the raw text using PDF.js.
2. **Keyword Extraction** – Both resume and job description are cleaned and split into frequency‑ranked keywords (stop‑words removed).
3. **Skill Matching** – A curated knowledge base of technical, soft, and domain skills is used to identify which skills appear in both documents.
4. **Scoring** –  
   - **Overall Match**: Weighted combination of keyword similarity (Jaccard), skill match, experience indicators, and education keywords.  
   - **Skills Match**: Percentage of job‑required skills found in the resume.  
   - **Experience Score**: Based on presence of experience‑related terms (e.g., "led", "managed", "senior").  
   - **Education Score**: Based on education‑related terms (e.g., "degree", "certification", "PhD").
5. **Strengths & Gaps** – Identifies common keywords and matched skills as strengths; missing skills and brief resume sections as gaps.
6. **RAG Insights** – A built‑in knowledge base provides context‑aware tips, industry trends, quick wins, and recommendations (simulating retrieval and generation).

---

## 🛠️ Technologies Used

- **HTML5 / CSS3** – Structure and responsive styling.
- **JavaScript (ES6)** – All logic, including keyword extraction, scoring, and UI updates.
- **PDF.js** – Client‑side PDF parsing (no server upload).
- **Font Awesome** – Icons for visual appeal.
- **No external APIs** – Everything runs locally in your browser.

---

## 🚀 Getting Started

### Prerequisites

None – just a modern web browser.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohammadtalhaa/AI-Resume-Analyzer.git
   ```
2. Open `index.html` in your browser:
   ```bash
   cd AI-Resume-Analyzer
   open index.html
   ```
3. Or simply visit the [live demo](https://mohammadtalhaa.github.io/AI-Resume-Analyzer/).

### Usage

1. **Enter Resume** – Paste your resume text into the left text area, or click “Upload PDF” to parse a PDF file.
2. **Enter Job Description** – Paste the job description into the right text area.
3. Click **“Analyze with RAG”**.
4. Review the score dashboard, strengths/gaps, and RAG‑enhanced insights.
5. Use the **“Clear All”** button to reset the form.

> **Tip:** For best results, ensure both texts are detailed and contain relevant keywords.

---

## 📁 Project Structure

```
AI-Resume-Analyzer/
├── index.html          # Single‑file application (HTML + CSS + JS)
└── README.md           # This file
```

---

## 🔍 Example Output

- **Overall Match**: 78%  
- **Skills Match**: 85%  
- **Strengths**: “Matched skills: Python, JavaScript, SQL”, “Shared keywords: cloud, agile, team”  
- **Gaps**: “Missing skills: Docker, Kubernetes”, “Resume is brief – consider adding more detail”  
- **RAG Insights**:
  - *Resume Tip*: “Quantify your impact with numbers.”
  - *Industry Trend*: “The tech industry values cloud skills and agile methodologies.”
  - *Quick Win*: “Add a projects section with 2‑3 detailed examples.”
  - *Recommendation*: “Prepare for behavioral interviews using the STAR method.”

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving the knowledge base, scoring algorithms, or UI, please:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-idea`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-idea`).
5. Open a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🙏 Acknowledgments

- Built with ❤️ using vanilla web technologies.
- [PDF.js](https://mozilla.github.io/pdf.js/) for client‑side PDF parsing.
- [Font Awesome](https://fontawesome.com/) for icons.

---

## 📬 Contact

- **GitHub:** [mohammadtalhaa](https://github.com/mohammadtalhaa)
- **Live Demo:** [AI Resume Analyzer](https://mohammadtalhaa.github.io/AI-Resume-Analyzer/)

---

*Enhance your job application with AI‑powered insights – all in your browser!* 🚀📄
