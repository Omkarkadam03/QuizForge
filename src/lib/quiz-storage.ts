import type { ActiveQuiz, QuizResult } from "./quiz-engine";

const KEYS = {
  user: "quizforge.user",
  history: "quizforge.history",
  active: "quizforge.active",
  pending: "quizforge.pending",
} as const;

export interface DemoUser {
  name: string;
  email: string;
  joinedAt: number;
}

export interface PendingQuiz {
  category: string;
  topic: string;
  lifeline: string | null;
  spun: boolean;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — demo still works in-memory */
  }
}

function remove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const storage = {
  getUser: () => read<DemoUser>(KEYS.user),
  setUser: (user: DemoUser) => write(KEYS.user, user),
  clearUser: () => remove(KEYS.user),

  getHistory: () => read<QuizResult[]>(KEYS.history) ?? [],
  addResult: (result: QuizResult) => {
    const history = read<QuizResult[]>(KEYS.history) ?? [];
    const next = [result, ...history.filter((r) => r.id !== result.id)].slice(0, 50);
    write(KEYS.history, next);
    return next;
  },
  clearHistory: () => remove(KEYS.history),

  getActive: () => read<ActiveQuiz>(KEYS.active),
  setActive: (quiz: ActiveQuiz | null) => (quiz ? write(KEYS.active, quiz) : remove(KEYS.active)),

  getPending: () => read<PendingQuiz>(KEYS.pending),
  setPending: (pending: PendingQuiz | null) => (pending ? write(KEYS.pending, pending) : remove(KEYS.pending)),
};
