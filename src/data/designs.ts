export type DesignCategory = "All" | "UI/UX" | "3D" | "Branding";

export interface Design {
  title: string;
  description: string;
  category: Exclude<DesignCategory, "All">;
  tool: string;
  gradient: string;
  image?: string;
  year: string;
}

export const designs: Design[] = [
  {
    title: "Abstract Product Render",
    description: "3D product visualisation exploring material shading and HDRI lighting in Blender.",
    category: "3D",
    tool: "Blender",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    image: "/designs/abstract-render.jpg",
    year: "2025",
  },
  {
    title: "Lamp — Shapr3D Model",
    description: "Curved wood & glass lamp modelled in Shapr3D with generative render lighting.",
    category: "3D",
    tool: "Shapr3D",
    gradient: "#1a1a1a",
    image: "/designs/shapr3d-lamp.jpg",
    year: "2026",
  },
  {
    title: "AI Chatbot Dashboard",
    description: "End-to-end UI design for a conversational AI product with dark mode and data visualisation.",
    category: "UI/UX",
    tool: "Figma",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    year: "2026",
  },
  {
    title: "Attendance System Interface",
    description: "Clean admin dashboard for the face-recognition attendance system with real-time logs.",
    category: "UI/UX",
    tool: "Figma",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    year: "2026",
  },
  {
    title: "Resume Screener App",
    description: "Streamlit-based UI prototype designed in Figma before implementation.",
    category: "UI/UX",
    tool: "Adobe XD",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    year: "2025",
  },
  {
    title: "Personal Brand Identity",
    description: "Logo, colour palette, and type system for my personal portfolio brand.",
    category: "Branding",
    tool: "Illustrator",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    year: "2024",
  },
];

export const categories: DesignCategory[] = ["All", "UI/UX", "3D", "Branding"];

export const toolColors: Record<string, string> = {
  Figma: "#0088ff",
  "Adobe XD": "#ff61f6",
  Blender: "#ea7600",
  Shapr3D: "#1a1a1a",
  Illustrator: "#ff9a00",
};
