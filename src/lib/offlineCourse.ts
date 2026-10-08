
import { Course } from "@/Components/data/constant";
import { CourseSummary } from "@/Components/data/courseCatalog";

type OfflineImage = {
  url: string;
  blob: Blob;
};

type OfflineCourseRecord = {
  id: string;
  course: Omit<Course, "modules"> & {
    modules: Array<Omit<Course["modules"][number], "videoId">>;
  };
  savedAt: number;
};

type DownloadableCourse = Course | CourseSummary;

const DB_NAME = "coursera-offline-content";
const DB_VERSION = 1;
const COURSE_STORE = "courses";
const IMAGE_STORE = "images";

const isBrowser = () => typeof window !== "undefined" && typeof indexedDB !== "undefined";

const openDb = (): Promise<IDBDatabase> => {
  if (!isBrowser()) {
    return Promise.reject(new Error("IndexedDB is not available in this environment."));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(COURSE_STORE)) {
        db.createObjectStore(COURSE_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE, { keyPath: "url" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open IndexedDB."));
  });
};

const requestToPromise = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("IndexedDB request failed."));
  });

const transactionDone = (transaction: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("IndexedDB transaction failed."));
    transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction aborted."));
  });

const getCourseImages = (course: DownloadableCourse): string[] => {
  const testimonialImages = "testimonials" in course
    ? course.testimonials.map((testimonial) => testimonial.image)
    : [];
  return Array.from(new Set([course.image, ...testimonialImages].filter(Boolean)));
};

const normalizeCourse = (course: DownloadableCourse): Course => {
  if ("modules" in course) {
    return course;
  }

  return {
    ...course,
    rating: "",
    students: "",
    level: "",
    timeline: "",
    lastUpdated: "",
    languages: [],
    price: { monthly: "", fullCourse: "" },
    skills: course.tags,
    modules: [],
    testimonials: [],
    careerOutcomes: [],
  };
};

const stripVideoContent = (input: DownloadableCourse): OfflineCourseRecord["course"] => {
  const course = normalizeCourse(input);
  return {
    ...course,
    modules: course.modules.map(({ videoId, ...module }) => module),
  };
};

const cacheImage = async (db: IDBDatabase, url: string) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      return;
    }

    const blob = await response.blob();
    const transaction = db.transaction(IMAGE_STORE, "readwrite");
    transaction.objectStore(IMAGE_STORE).put({ url, blob });
    await transactionDone(transaction);
  } catch {
    // A single image failing should not prevent the rest of the course from being saved.
  }
};

export const saveCourseOffline = async (course: DownloadableCourse): Promise<void> => {
  const db = await openDb();

  const courseRecord: OfflineCourseRecord = {
    id: course.id,
    course: stripVideoContent(course),
    savedAt: Date.now(),
  };

  const courseTransaction = db.transaction(COURSE_STORE, "readwrite");
  courseTransaction.objectStore(COURSE_STORE).put(courseRecord);
  await transactionDone(courseTransaction);

  for (const imageUrl of getCourseImages(course)) {
    await cacheImage(db, imageUrl);
  }

  db.close();
};

export const isCourseOffline = async (courseId: string): Promise<boolean> => {
  try {
    const db = await openDb();
    const transaction = db.transaction(COURSE_STORE, "readonly");
    const record = await requestToPromise(transaction.objectStore(COURSE_STORE).get(courseId));
    db.close();
    return Boolean(record);
  } catch {
    return false;
  }
};

export const getOfflineCourse = async (courseId: string): Promise<OfflineCourseRecord["course"] | null> => {
  try {
    const db = await openDb();
    const transaction = db.transaction(COURSE_STORE, "readonly");
    const record = await requestToPromise<OfflineCourseRecord | undefined>(
      transaction.objectStore(COURSE_STORE).get(courseId)
    );
    db.close();
    return record?.course || null;
  } catch {
    return null;
  }
};

export const getOfflineCourseIds = async (): Promise<string[]> => {
  try {
    const db = await openDb();
    const transaction = db.transaction(COURSE_STORE, "readonly");
    const ids = await requestToPromise<IDBValidKey[]>(transaction.objectStore(COURSE_STORE).getAllKeys());
    db.close();
    return ids.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
};

export const getOfflineImageUrl = async (url: string): Promise<string | null> => {
  if (!url || !isBrowser()) {
    return null;
  }

  try {
    const db = await openDb();
    const transaction = db.transaction(IMAGE_STORE, "readonly");
    const record = await requestToPromise<OfflineImage | undefined>(
      transaction.objectStore(IMAGE_STORE).get(url)
    );
    db.close();

    if (!record?.blob) {
      return null;
    }

    return URL.createObjectURL(record.blob);
  } catch {
    return null;
  }
};

export const removeCourseOffline = async (courseId: string): Promise<void> => {
  try {
    const db = await openDb();
    const transaction = db.transaction(COURSE_STORE, "readwrite");
    transaction.objectStore(COURSE_STORE).delete(courseId);
    await transactionDone(transaction);
    db.close();
  } catch {
    
  }
};
