const STORAGE_KEY = "coursera-video-progress";

interface VideoProgress {
  courseId: string;
  videoId: string;
  timestamp: number;
  updatedAt: number;
}

type ProgressStore = Record<string, VideoProgress>;

const getStore = (): ProgressStore => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
    );
  } catch {
    return {};
  }
};

export const getVideoProgress = (
  courseId: string,
  videoId: string
): number => {
  const store = getStore();

  const key = `${courseId}_${videoId}`;

  return store[key]?.timestamp || 0;
};

export const saveVideoProgress = (
  courseId: string,
  videoId: string,
  timestamp: number
) => {
  if (typeof window === "undefined") {
    return;
  }

  const store = getStore();

  const key = `${courseId}_${videoId}`;

  store[key] = {
    courseId,
    videoId,
    timestamp,
    updatedAt: Date.now(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(store)
  );
};

export const clearVideoProgress = (
  courseId: string,
  videoId: string
) => {
  if (typeof window === "undefined") {
    return;
  }

  const store = getStore();

  const key = `${courseId}_${videoId}`;

  delete store[key];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(store)
  );
};