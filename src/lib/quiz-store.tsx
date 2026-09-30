import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buildQuizQuestions, getCategory, getTopic, QUIZ_DURATION_SEC } from "./quiz-bank";
import {
  buildResult,
  computeFiftyFifty,
  type ActiveQuiz,
  type LifelineId,
  type QuizEndReason,
  type QuizResult,
} from "./quiz-engine";
import { storage, type DemoUser, type PendingQuiz } from "./quiz-storage";

interface AppContextValue {
  hydrated: boolean;
  user: DemoUser | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  history: QuizResult[];
  clearHistory: () => void;
  pending: PendingQuiz | null;
  preparePending: (category: string, topic: string) => void;
  awardLifeline: (lifeline: LifelineId) => void;
  quiz: ActiveQuiz | null;
  remainingSec: number;
  startQuiz: (category: string, topic: string) => boolean;
  answer: (optionIndex: number) => void;
  goTo: (index: number) => void;
  useLifelineNow: () => void;
  submitQuiz: (reason?: QuizEndReason) => QuizResult | null;
  getResult: (id: string) => QuizResult | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [pending, setPending] = useState<PendingQuiz | null>(null);
  const [quiz, setQuiz] = useState<ActiveQuiz | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const submittingRef = useRef(false);

  // Hydrate from localStorage after mount (SSR-safe).
  useEffect(() => {
    setUser(storage.getUser());
    setHistory(storage.getHistory());
    setPending(storage.getPending());
    const active = storage.getActive();
    if (active && !active.submitted) setQuiz(active);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) storage.setActive(quiz && !quiz.submitted ? quiz : null);
  }, [quiz, hydrated]);

  useEffect(() => {
    if (hydrated) storage.setPending(pending);
  }, [pending, hydrated]);

  // Single ticking interval, independent of re-renders.
  useEffect(() => {
    if (!quiz || quiz.submitted) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    setNow(Date.now());
    return () => window.clearInterval(id);
  }, [quiz?.quizId, quiz?.submitted]);

  const remainingSec = quiz && !quiz.submitted ? Math.max(0, Math.round((quiz.endsAt - now) / 1000)) : 0;

  const signIn = useCallback((email: string, name?: string) => {
    const demoUser: DemoUser = {
      email,
      name: name?.trim() || email.split("@")[0] || "Player",
      joinedAt: Date.now(),
    };
    storage.setUser(demoUser);
    setUser(demoUser);
  }, []);

  const signOut = useCallback(() => {
    storage.clearUser();
    storage.setActive(null);
    storage.setPending(null);
    setUser(null);
    setQuiz(null);
    setPending(null);
  }, []);

  const clearHistory = useCallback(() => {
    storage.clearHistory();
    setHistory([]);
  }, []);

  const preparePending = useCallback((category: string, topic: string) => {
    setPending({ category, topic, lifeline: null, spun: false });
  }, []);

  const awardLifeline = useCallback((lifeline: LifelineId) => {
    setPending((prev) => (prev && !prev.spun ? { ...prev, lifeline, spun: true } : prev));
  }, []);

  const startQuiz = useCallback(
    (category: string, topic: string) => {
      const questions = buildQuizQuestions(category, topic);
      if (questions.length === 0) return false;
      const gamingMode = category === "gaming";
      const awarded = gamingMode ? ((pending?.lifeline as LifelineId | null) ?? null) : null;
      const initialLives = gamingMode ? (awarded === "life" ? 4 : 3) : 0;
      const startedAt = Date.now();
      submittingRef.current = false;
      setQuiz({
        quizId: `qz_${startedAt.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        category,
        topic,
        questions,
        currentIndex: 0,
        answers: {},
        locked: {},
        skipped: [],
        gamingMode,
        lives: initialLives,
        initialLives,
        awardedLifeline: awarded,
        lifelineUsed: false,
        fiftyFiftyHidden: {},
        hintForIndex: null,
        startedAt,
        endsAt: startedAt + QUIZ_DURATION_SEC * 1000,
        submitted: false,
        endReason: null,
      });
      setNow(startedAt);
      return true;
    },
    [pending],
  );

  const submitQuiz = useCallback(
    (reason: QuizEndReason = "submitted"): QuizResult | null => {
      if (!quiz || quiz.submitted || submittingRef.current) return null;
      submittingRef.current = true;
      const result = buildResult(
        quiz,
        {
          categoryName: getCategory(quiz.category)?.name ?? quiz.category,
          topicName: getTopic(quiz.category, quiz.topic)?.name ?? quiz.topic,
        },
        reason,
      );
      setHistory(storage.addResult(result));
      storage.setActive(null);
      setQuiz(null);
      setPending(null);
      return result;
    },
    [quiz],
  );

  const answer = useCallback((optionIndex: number) => {
    setQuiz((prev) => {
      if (!prev || prev.submitted) return prev;
      const idx = prev.currentIndex;
      if (prev.skipped.includes(idx)) return prev;
      if (prev.gamingMode && prev.locked[idx]) return prev; // never deduct twice
      const question = prev.questions[idx];
      if (!question) return prev;
      const isCorrect = optionIndex === question.correctAnswer;
      const answers = { ...prev.answers, [idx]: optionIndex };
      if (!prev.gamingMode) return { ...prev, answers };
      const lives = isCorrect ? prev.lives : Math.max(0, prev.lives - 1);
      return {
        ...prev,
        answers,
        locked: { ...prev.locked, [idx]: true },
        lives,
      };
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setQuiz((prev) => {
      if (!prev || prev.submitted) return prev;
      const clamped = Math.min(Math.max(0, index), prev.questions.length - 1);
      return { ...prev, currentIndex: clamped, hintForIndex: prev.hintForIndex };
    });
  }, []);

  const useLifelineNow = useCallback(() => {
    setQuiz((prev) => {
      if (!prev || prev.submitted || !prev.gamingMode) return prev;
      if (!prev.awardedLifeline || prev.lifelineUsed) return prev;
      const idx = prev.currentIndex;
      const question = prev.questions[idx];
      if (!question) return prev;
      const answered = prev.answers[idx] !== undefined;
      switch (prev.awardedLifeline) {
        case "hint":
          if (answered) return prev;
          return { ...prev, lifelineUsed: true, hintForIndex: idx };
        case "fifty":
          if (answered) return prev;
          return {
            ...prev,
            lifelineUsed: true,
            fiftyFiftyHidden: { ...prev.fiftyFiftyHidden, [idx]: computeFiftyFifty(question) },
          };
        case "skip": {
          if (answered) return prev;
          const nextIndex = Math.min(idx + 1, prev.questions.length - 1);
          return {
            ...prev,
            lifelineUsed: true,
            skipped: [...prev.skipped, idx],
            currentIndex: nextIndex,
          };
        }
        case "life":
          return prev; // applied at quiz start
        default:
          return prev;
      }
    });
  }, []);

  const getResult = useCallback((id: string) => history.find((r) => r.id === id), [history]);

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated,
      user,
      signIn,
      signOut,
      history,
      clearHistory,
      pending,
      preparePending,
      awardLifeline,
      quiz,
      remainingSec,
      startQuiz,
      answer,
      goTo,
      useLifelineNow,
      submitQuiz,
      getResult,
    }),
    [hydrated, user, signIn, signOut, history, clearHistory, pending, preparePending, awardLifeline, quiz, remainingSec, startQuiz, answer, goTo, useLifelineNow, submitQuiz, getResult],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
