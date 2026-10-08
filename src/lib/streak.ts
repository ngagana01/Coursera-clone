export type StreakBadge = {
  id: string;
  title: string;
  description: string;
  days: number;
  earned: boolean;
};

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  totalLearningDays: number;
  lastActivityDate: string | null;
  activityDates: string[];
  badges: StreakBadge[];
};

const STORAGE_KEY = "coursera-learning-streak";
const STREAK_EVENT = "coursera-streak-updated";

const BADGE_DEFINITIONS = [
  { id: "3-day", title: "3-Day Starter", description: "Learn for 3 consecutive days.", days: 3 },
  { id: "7-day", title: "7-Day Streak", description: "Keep learning for 7 consecutive days.", days: 7 },
  { id: "14-day", title: "14-Day Learner", description: "Keep learning for 14 consecutive days.", days: 14 },
  { id: "30-day", title: "30-Day Champion", description: "Keep learning for 30 consecutive days.", days: 30 },
];

const emptyStreak = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  totalLearningDays: 0,
  lastActivityDate: null,
  activityDates: [],
  badges: BADGE_DEFINITIONS.map((badge) => ({ ...badge, earned: false })),
});

const isBrowser = () => typeof window !== "undefined";

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const daysBetween = (from: string, to: string) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((fromDateKey(to).getTime() - fromDateKey(from).getTime()) / msPerDay);
};

const readStreak = (): StreakData => {
  if (!isBrowser()) return emptyStreak();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyStreak();

    const parsed = JSON.parse(stored) as Partial<StreakData>;
    const activityDates = Array.isArray(parsed.activityDates)
      ? parsed.activityDates.filter((date): date is string => typeof date === "string")
      : [];

    return {
      currentStreak: Number(parsed.currentStreak) || 0,
      longestStreak: Number(parsed.longestStreak) || 0,
      totalLearningDays: Number(parsed.totalLearningDays) || activityDates.length,
      lastActivityDate: typeof parsed.lastActivityDate === "string" ? parsed.lastActivityDate : null,
      activityDates,
      badges: BADGE_DEFINITIONS.map((badge) => ({
        ...badge,
        earned: activityDates.length > 0 && (Number(parsed.longestStreak) || 0) >= badge.days,
      })),
    };
  } catch {
    return emptyStreak();
  }
};

const saveStreak = (data: StreakData) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(STREAK_EVENT));
};

export const getStreakData = (): StreakData => readStreak();

export const recordDailyLearning = (): StreakData => {
  const data = readStreak();
  const today = toDateKey(new Date());

  
  if (data.lastActivityDate === today) {
    return data;
  }

  let currentStreak = 1;

  if (data.lastActivityDate) {
    const difference = daysBetween(data.lastActivityDate, today);
    currentStreak = difference === 1 ? data.currentStreak + 1 : 1;
  }

  const activityDates = Array.from(new Set([...data.activityDates, today])).sort();
  const longestStreak = Math.max(data.longestStreak, currentStreak);

  const updated: StreakData = {
    currentStreak,
    longestStreak,
    totalLearningDays: activityDates.length,
    lastActivityDate: today,
    activityDates,
    badges: BADGE_DEFINITIONS.map((badge) => ({
      ...badge,
      earned: longestStreak >= badge.days,
    })),
  };

  saveStreak(updated);
  return updated;
};

export const getStreakEventName = () => STREAK_EVENT;
