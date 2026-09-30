import type { Question } from "../data/types";

export type LifelineId = "hint" | "fifty" | "skip" | "life";

export interface LifelineMeta {
  id: LifelineId;
  label: string;
  emoji: string;
  blurb: string;
}

export const LIFELINES: LifelineMeta[] = [
  { id: "hint", label: "Hint", emoji: "💡", blurb: "Reveal a clue for the current question." },
  { id: "fifty", label: "50/50", emoji: "✂️", blurb: "Remove two incorrect options." },
  { id: "skip", label: "Skip", emoji: "⏭️", blurb: "Skip a question with no life lost." },
  { id: "life", label: "+1 Life", emoji: "❤️", blurb: "Start the quiz with an extra life." },
];

export type QuizEndReason = "submitted" | "timeout" | "completed" | "gameover";
export type AnswerStatus = "correct" | "wrong" | "skipped" | "unanswered";

export interface ActiveQuiz {
  quizId: string;
  category: string;
  topic: string;
  questions: Question[];
  currentIndex: number;
  /** questionIndex -> chosen option index */
  answers: Record<number, number>;
  /** gaming: answers are final once submitted */
  locked: Record<number, boolean>;
  skipped: number[];
  gamingMode: boolean;
  lives: number;
  initialLives: number;
  awardedLifeline: LifelineId | null;
  lifelineUsed: boolean;
  /** questionIndex -> option indexes hidden by 50/50 */
  fiftyFiftyHidden: Record<number, number[]>;
  hintForIndex: number | null;
  startedAt: number;
  endsAt: number;
  submitted: boolean;
  endReason: QuizEndReason | null;
}

export interface ReviewItem {
  question: string;
  options: string[];
  correctAnswer: number;
  chosen: number | null;
  status: AnswerStatus;
  explanation: string;
}

export interface QuizResult {
  id: string;
  category: string;
  categoryName: string;
  topic: string;
  topicName: string;
  date: number;
  total: number;
  correct: number;
  wrong: number;
  skipped: number;
  unanswered: number;
  percentage: number;
  timeUsedSec: number;
  gamingMode: boolean;
  endReason: QuizEndReason;
  livesLeft: number;
  initialLives: number;
  awardedLifeline: LifelineId | null;
  lifelineUsed: boolean;
  review: ReviewItem[];
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function pickRandomLifeline(): LifelineId {
  return LIFELINES[Math.floor(Math.random() * LIFELINES.length)]!.id;
}

export function computeFiftyFifty(question: Question): number[] {
  const wrong = question.options
    .map((_, i) => i)
    .filter((i) => i !== question.correctAnswer)
    .sort(() => Math.random() - 0.5);
  return wrong.slice(0, 2);
}

/** Pure scoring: derives all result statistics from an active quiz. */
export function buildResult(
  quiz: ActiveQuiz,
  meta: { categoryName: string; topicName: string },
  endReason: QuizEndReason,
): QuizResult {
  const skippedSet = new Set(quiz.skipped);
  const review: ReviewItem[] = quiz.questions.map((q, i) => {
    if (skippedSet.has(i)) {
      return { question: q.question, options: q.options, correctAnswer: q.correctAnswer, chosen: null, status: "skipped", explanation: q.explanation };
    }
    const chosen = quiz.answers[i];
    if (chosen === undefined) {
      return { question: q.question, options: q.options, correctAnswer: q.correctAnswer, chosen: null, status: "unanswered", explanation: q.explanation };
    }
    return {
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      chosen,
      status: chosen === q.correctAnswer ? "correct" : "wrong",
      explanation: q.explanation,
    };
  });

  const correct = review.filter((r) => r.status === "correct").length;
  const wrong = review.filter((r) => r.status === "wrong").length;
  const skipped = review.filter((r) => r.status === "skipped").length;
  const unanswered = review.filter((r) => r.status === "unanswered").length;
  const total = quiz.questions.length;

  return {
    id: quiz.quizId,
    category: quiz.category,
    categoryName: meta.categoryName,
    topic: quiz.topic,
    topicName: meta.topicName,
    date: Date.now(),
    total,
    correct,
    wrong,
    skipped,
    unanswered,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    timeUsedSec: Math.max(0, Math.round((Date.now() - quiz.startedAt) / 1000)),
    gamingMode: quiz.gamingMode,
    endReason,
    livesLeft: quiz.lives,
    initialLives: quiz.initialLives,
    awardedLifeline: quiz.awardedLifeline,
    lifelineUsed: quiz.lifelineUsed,
    review,
  };
}
