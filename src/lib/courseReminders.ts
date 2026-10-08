export type ReminderOption = "1-hour" | "tomorrow" | "none";

export type CourseReminder = {
  courseId: string;
  courseTitle: string;
  remindAt: number | null;
  option: ReminderOption;
};

const STORAGE_KEY = "coursera-course-reminders";
const REMINDER_EVENT = "coursera-course-reminders-updated";
const MAX_TIMEOUT = 2147483647;

const isBrowser = () => typeof window !== "undefined";

const readReminders = (): Record<string, CourseReminder> => {
  if (!isBrowser()) return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Record<string, CourseReminder>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const saveReminders = (reminders: Record<string, CourseReminder>) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  window.dispatchEvent(new Event(REMINDER_EVENT));
};

export const getCourseReminder = (courseId: string): CourseReminder | null => {
  return readReminders()[courseId] || null;
};

export const getReminderEventName = () => REMINDER_EVENT;

export const requestNotificationPermission = async (): Promise<NotificationPermission | "unsupported"> => {
  if (!isBrowser() || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
};

export const showCourseReminderNotification = (reminder: CourseReminder) => {
  if (!isBrowser() || !("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification("Course Reminder 🔔", {
    body: `Continue learning: ${reminder.courseTitle}`,
    tag: `course-reminder-${reminder.courseId}`,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = `/course/${encodeURIComponent(reminder.courseId)}`;
    notification.close();
  };
};

export const clearCourseReminder = (courseId: string) => {
  const reminders = readReminders();
  delete reminders[courseId];
  saveReminders(reminders);
};

export const setCourseReminder = async (
  courseId: string,
  courseTitle: string,
  option: ReminderOption
): Promise<{ reminder: CourseReminder | null; permission: NotificationPermission | "unsupported" }> => {
  if (!isBrowser()) return { reminder: null, permission: "unsupported" };

  const reminders = readReminders();

  if (option === "none") {
    delete reminders[courseId];
    saveReminders(reminders);
    return { reminder: null, permission: "Notification" in window ? Notification.permission : "unsupported" };
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    return { reminder: null, permission };
  }

  const delay = option === "1-hour" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const reminder: CourseReminder = {
    courseId,
    courseTitle,
    remindAt: Date.now() + delay,
    option,
  };

  reminders[courseId] = reminder;
  saveReminders(reminders);
  return { reminder, permission };
};

const fireDueReminders = () => {
  if (!isBrowser()) return;

  const reminders = readReminders();
  const now = Date.now();
  let changed = false;

  Object.entries(reminders).forEach(([courseId, reminder]) => {
    if (reminder.remindAt && reminder.remindAt <= now) {
      showCourseReminderNotification(reminder);
      delete reminders[courseId];
      changed = true;
    }
  });

  if (changed) saveReminders(reminders);
};

const scheduleReminder = (reminder: CourseReminder) => {
  if (!isBrowser() || !reminder.remindAt) return;

  const delay = reminder.remindAt - Date.now();
  if (delay <= 0) {
    fireDueReminders();
    return;
  }

  
  window.setTimeout(() => scheduleReminder(reminder), Math.min(delay, MAX_TIMEOUT));
};

export const initializeCourseReminders = () => {
  if (!isBrowser()) return;

  fireDueReminders();
  Object.values(readReminders()).forEach(scheduleReminder);
};
