export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "AI & Machine Learning",
    items: [
      "Supervised & Unsupervised Learning",
      "Classification",
      "Regression",
      "Clustering",
      "ANN",
      "CNN",
      "RNN",
      "Model Tuning",
    ],
  },
  {
    category: "LLM & GenAI",
    items: [
      "LangChain",
      "OpenAI API",
      "HuggingFace",
      "BERT",
      "Sentence Transformers",
      "RAG",
      "FAISS",
      "Prompt Engineering",
    ],
  },
  {
    category: "Computer Vision",
    items: ["OpenCV", "DeepFace", "dlib"],
  },
  {
    category: "Programming & Libraries",
    items: [
      "Python",
      "SQL",
      "Git",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "spaCy",
      "MLflow",
    ],
  },
  {
    category: "Deployment & Cloud",
    items: ["Docker", "AWS", "Google Cloud", "Flask", "Streamlit", "SQLite"],
  },
  {
    category: "Product Design & UX",
    items: [
      "Figma",
      "Adobe XD",
      "Illustrator",
      "Blender",
      "Shapr3D",
      "Wireframing",
      "Prototyping",
      "Design Thinking",
      "User Research",
    ],
  },
];
