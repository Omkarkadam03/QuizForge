import type { Question, TopicBank } from "../data/types";
import { gamingQuestions } from "../data/questions/gaming";
import { academicQuestions } from "../data/questions/academic";
import { aptitudeQuestions } from "../data/questions/aptitude";
import { aiToolsQuestions } from "../data/questions/aitools";
import { gkQuestions } from "../data/questions/gk";
import { codingQuestions } from "../data/questions/coding";

export interface TopicMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface CategoryMeta {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  special: boolean;
  topics: TopicMeta[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "gaming",
    name: "Gaming",
    emoji: "🎮",
    tagline: "Lives · Spin Wheel · Lifelines",
    description: "A gamified arena mode with 3 lives, a spin wheel and one strategic lifeline.",
    special: true,
    topics: [
      { id: "github", name: "GitHub", description: "Branches, commits, pull requests and Actions.", icon: "🐙" },
      { id: "aws", name: "AWS", description: "EC2, S3, IAM, Lambda and cloud fundamentals.", icon: "☁️" },
      { id: "cybersecurity", name: "Cybersecurity", description: "Encryption, threats and defensive practices.", icon: "🛡️" },
    ],
  },
  {
    id: "academic",
    name: "Academic",
    emoji: "📚",
    tagline: "Core CSE subjects",
    description: "Classic computer science coursework, exam-style and concept driven.",
    special: false,
    topics: [
      { id: "data-structures", name: "Data Structures", description: "Arrays, trees, graphs and complexity.", icon: "🌳" },
      { id: "operating-systems", name: "Operating Systems", description: "Processes, memory, scheduling and deadlocks.", icon: "🖥️" },
      { id: "computer-networks", name: "Computer Networks", description: "OSI, TCP/IP, DNS and routing.", icon: "🌐" },
    ],
  },
  {
    id: "aptitude",
    name: "Aptitude",
    emoji: "🧠",
    tagline: "Competitive exams",
    description: "Reasoning and general studies in the style of Indian competitive exams.",
    special: false,
    topics: [
      { id: "mpsc", name: "MPSC", description: "Maharashtra state services style questions.", icon: "🏛️" },
      { id: "upsc", name: "UPSC", description: "Polity, economy and national affairs.", icon: "📜" },
      { id: "neet", name: "NEET", description: "Biology, chemistry and physics basics.", icon: "🧬" },
    ],
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    emoji: "🤖",
    tagline: "Modern AI literacy",
    description: "How today's AI assistants and models actually work.",
    special: false,
    topics: [
      { id: "chatgpt", name: "ChatGPT", description: "Prompting, tokens and LLM behaviour.", icon: "💬" },
      { id: "gemini", name: "Gemini", description: "Multimodal models and grounded answers.", icon: "✨" },
      { id: "deepseek", name: "DeepSeek", description: "Open-weight models, MoE and self-hosting.", icon: "🔎" },
    ],
  },
  {
    id: "general-knowledge",
    name: "General Knowledge",
    emoji: "🌍",
    tagline: "India & the world",
    description: "History, geography, culture and current affairs.",
    special: false,
    topics: [
      { id: "indian-gk", name: "Indian GK", description: "History, geography and constitution.", icon: "🇮🇳" },
      { id: "world-gk", name: "World GK", description: "Global facts, places and people.", icon: "🗺️" },
      { id: "current-affairs", name: "Current Affairs", description: "Recent developments and global themes.", icon: "📰" },
    ],
  },
  {
    id: "coding",
    name: "Coding",
    emoji: "💻",
    tagline: "Language mastery",
    description: "Language-specific fundamentals for interviews and practice.",
    special: false,
    topics: [
      { id: "cpp", name: "C++", description: "OOP, STL, pointers and memory.", icon: "⚙️" },
      { id: "python", name: "Python", description: "Syntax, data structures and OOP.", icon: "🐍" },
      { id: "java", name: "Java", description: "JVM, collections and concurrency.", icon: "☕" },
    ],
  },
];

const BANKS: Record<string, TopicBank> = {
  gaming: gamingQuestions,
  academic: academicQuestions,
  aptitude: aptitudeQuestions,
  "ai-tools": aiToolsQuestions,
  "general-knowledge": gkQuestions,
  coding: codingQuestions,
};

export const QUIZ_LENGTH = 20;
export const QUIZ_DURATION_SEC = 30 * 60;

export function getCategory(id: string | undefined): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getTopic(categoryId: string | undefined, topicId: string | undefined): TopicMeta | undefined {
  return getCategory(categoryId)?.topics.find((t) => t.id === topicId);
}

export function totalTopics(): number {
  return CATEGORIES.reduce((sum, c) => sum + c.topics.length, 0);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Selects a randomised set of questions for a quiz. Never throws on bad input. */
export function buildQuizQuestions(categoryId: string, topicId: string): Question[] {
  const raw = BANKS[categoryId]?.[topicId] ?? [];
  const mapped: Question[] = raw.map((r, i) => ({
    id: `${categoryId}-${topicId}-${i + 1}`,
    category: categoryId,
    topic: topicId,
    question: r[0],
    options: r[1],
    correctAnswer: r[2],
    explanation: r[3],
    hint: r[4],
  }));
  return shuffle(mapped).slice(0, QUIZ_LENGTH);
}
