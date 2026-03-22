export interface Cert {
  title: string;
  org: string;
  date: string;
  instructor?: string;
  accent: string;
  image: string;
  duration?: string;
}

export const certifications: Cert[] = [
  {
    title: "Machine Learning Explainability",
    org: "Kaggle",
    date: "Mar 2026",
    instructor: "Dan Becker",
    accent: "#20beff",
    image: "/certs/cert-kaggle-mlexplain.jpg",
  },
  {
    title: "Intro to Game AI and Reinforcement Learning",
    org: "Kaggle",
    date: "Feb 2026",
    accent: "#20beff",
    image: "/certs/cert-kaggle-gameai.jpg",
  },
  {
    title: "Master Generative AI & Generative AI Tools (ChatGPT & more)",
    org: "Udemy",
    date: "Dec 2025",
    duration: "14.5 hrs",
    instructor: "Saad A",
    accent: "#a435f0",
    image: "/certs/cert-udemy-genai.png",
  },
  {
    title: "ChatGPT AI Complete Course: ChatGPT Beginner to Expert",
    org: "Udemy",
    date: "Dec 2025",
    instructor: "Steve Ballinger",
    accent: "#a435f0",
    image: "/certs/cert-udemy-chatgpt.png",
  },
  {
    title: "Build Generative AI Apps and Solutions with No-Code Tools",
    org: "Udemy",
    date: "Dec 2025",
    duration: "5.5 hrs",
    instructor: "Henry Habib",
    accent: "#a435f0",
    image: "/certs/cert-udemy-nocode.png",
  },
  {
    title: "Computational Theory: Language Principle & Finite Automata Theory",
    org: "Infosys Springboard",
    date: "Dec 2025",
    accent: "#0066b2",
    image: "/certs/cert-infosys-comptheory.png",
  },
];
