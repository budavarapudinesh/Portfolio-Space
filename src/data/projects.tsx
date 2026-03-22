import type { ReactNode } from "react";

export interface Project {
  title: string;
  description: string;
  tech: string[];
  date: string;
  github: string;
  gradient: string;
  icon: ReactNode;
}

export const projects: Project[] = [
  {
    title: "AI Chatbot with RAG",
    description:
      "Built a context-aware AI chatbot using Retrieval-Augmented Generation that answers queries from custom documents with high factual accuracy. Achieved 89% answer relevance score and reduced hallucination by 40%.",
    tech: ["Python", "LangChain", "OpenAI API", "FAISS", "Streamlit"],
    date: "Mar 2026 – Apr 2026",
    github: "https://github.com/budavarapudinesh/ai-chatbot-rag",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="1.5">
        <rect x="8" y="12" width="32" height="24" rx="4" />
        <circle cx="18" cy="24" r="2" fill="white" />
        <circle cx="24" cy="24" r="2" fill="white" />
        <circle cx="30" cy="24" r="2" fill="white" />
      </svg>
    ),
  },
  {
    title: "Attendance System with Face Recognition",
    description:
      "Developed a real-time automated attendance system using facial recognition that detects, identifies, and logs student attendance from live webcam feed. Achieved 96.3% recognition accuracy across 50+ faces.",
    tech: ["Python", "OpenCV", "DeepFace", "dlib", "Flask", "SQLite"],
    date: "Jan 2026 – Mar 2026",
    github: "https://github.com/budavarapudinesh/attendance-face-recognition",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="1.5">
        <circle cx="24" cy="20" r="8" />
        <path d="M10 40c0-7 6-12 14-12s14 5 14 12" />
      </svg>
    ),
  },
  {
    title: "Resume Screener",
    description:
      "Built an NLP-based resume screening tool that automatically ranks and shortlists candidates by matching resume content against job descriptions using semantic similarity. Achieved 91% matching accuracy on 500+ resumes.",
    tech: ["Python", "spaCy", "Scikit-learn", "BERT", "Streamlit"],
    date: "Aug 2025 – Sep 2025",
    github: "https://github.com/budavarapudinesh/resume-screener",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="1.5">
        <rect x="12" y="8" width="24" height="32" rx="3" />
        <line x1="18" y1="16" x2="30" y2="16" />
        <line x1="18" y1="22" x2="30" y2="22" />
        <line x1="18" y1="28" x2="26" y2="28" />
      </svg>
    ),
  },
];
