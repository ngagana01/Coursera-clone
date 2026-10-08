import React, { useEffect, useState } from "react";
import {
  Star,
  Clock,
  Award,
  Users,
  CheckCircle2,
  PlayCircle,
  Download,
  Share2,
  BookmarkPlus,
  Globe,
  Calendar,
  Target,
  ChevronDown,
  Briefcase,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  FileText,
  WifiOff,
  Bell,
  BellOff,
} from "lucide-react";
import { useRouter } from "next/router";

import { Course, courses } from "@/Components/data/constant";
import { courseSummaries } from "@/Components/data/courseCatalog";
import Videolayer from "@/Components/Videolayer";

import { getVideoProgress } from "@/lib/videoProgress";
import { recordDailyLearning } from "@/lib/streak";

import {
  clearCourseReminder,
  getCourseReminder,
  setCourseReminder,
  type ReminderOption,
} from "@/lib/courseReminders";

import {
  getOfflineCourse,
  getOfflineImageUrl,
  isCourseOffline,
  removeCourseOffline,
  saveCourseOffline,
} from "@/lib/offlineCourse";

const extractYouTubeId = (value: string) => {
  if (!value) return "";

  
  if (
    !value.includes("/") &&
    !value.includes("?") &&
    !value.includes("=")
  ) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") || "";
    }

    if (url.hostname === "youtu.be") {
      return url.pathname.replace("/", "");
    }
  } catch {
    return "";
  }

  return "";
};

function CourseDetails() {
  

  const [selectedModule, setSelectedModule] = useState(0);
  const [showFullDescription, setShowFullDescription] =
    useState(false);

  const [selectedmoduleindex, setselectedmoduleindex] =
    useState(0);

  const [showmodulepage, setshowmodulepage] =
    useState(false);

  const [course, setCourse] =
    useState<Course | null>(null);

  const router = useRouter();
  const { id } = router.query;

  

  const [resumeTime, setResumeTime] = useState(0);
  const [resumeRequest, setResumeRequest] = useState(0);

  

  const [courseCompleted, setCourseCompleted] =
    useState(false);

  

  const [isOnline, setIsOnline] = useState(true);
  const [isSavedOffline, setIsSavedOffline] =
    useState(false);

  const [offlineSaving, setOfflineSaving] =
    useState(false);

  const [offlineMessage, setOfflineMessage] =
    useState("");

  

  const [reminderOption, setReminderOption] =
    useState<ReminderOption>("none");

  const [reminderMessage, setReminderMessage] =
    useState("");

  const [reminderSaving, setReminderSaving] =
    useState(false);

  
  const [courseImageSrc, setCourseImageSrc] =
    useState("");

  const [testimonialImageSrc, setTestimonialImageSrc] =
    useState<Record<number, string>>({});

  
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const loadCourse = async () => {
      const courseId = String(id);

      const foundCourse = courses.find(
        (c) => c.id === courseId
      );

      const summary = courseSummaries.find(
        (item) => item.id === courseId
      );

      const offlineCourse =
        await getOfflineCourse(courseId);

      
      if (offlineCourse) {
        if (mounted) {
          setCourse(offlineCourse as Course);
        }

        return;
      }

     
      if (foundCourse) {
        if (mounted) {
          setCourse(foundCourse);
        }

        return;
      }

    
      if (!summary) {
        if (mounted) {
          setCourse(null);
        }

        return;
      }

      

      const fallbackCourse: Course = {
        id: summary.id,
        title: summary.title,
        provider: summary.provider,
        type: summary.type,
        tags: summary.tags,
        image: summary.image,

        rating: "4.8",
        students: "Learners",
        level: "All levels",
        timeline: "Self-paced",
        lastUpdated: "Recently",

        languages: ["English"],

        price: {
          monthly: "Free",
          fullCourse: "Free",
        },

        description: summary.description,

        skills: summary.tags,

        modules: [
          {
            title: "Course Content",
            duration: "Self-paced",
            description: summary.description,
            weeks: 1,
            hours: 1,
            projects: 0,
            quizzes: 0,
            videoId: "",
          },
        ],

        testimonials: [],

        careerOutcomes: [],
      };

      if (mounted) {
        setCourse(fallbackCourse);
      }
    };

    loadCourse();

    return () => {
      mounted = false;
    };
  }, [id]);

  

  useEffect(() => {
    if (!course) {
      setResumeTime(0);
      return;
    }

    const currentModule =
      course.modules[selectedmoduleindex];

    if (!currentModule?.videoId) {
      setResumeTime(0);
      return;
    }

    const youtubeVideoId = extractYouTubeId(currentModule.videoId);

    if (!youtubeVideoId) {
    setResumeTime(0);
    return;
  }

    const savedTime = getVideoProgress(
      course.id,
      youtubeVideoId
    );

    console.log(
    "Resume progress:",
    course.id,
    youtubeVideoId,
    savedTime
  );

    setResumeTime(savedTime);
  }, [course, selectedmoduleindex]);

  

  useEffect(() => {
    const updateOnlineState = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineState();

    window.addEventListener(
      "online",
      updateOnlineState
    );

    window.addEventListener(
      "offline",
      updateOnlineState
    );

    return () => {
      window.removeEventListener(
        "online",
        updateOnlineState
      );

      window.removeEventListener(
        "offline",
        updateOnlineState
      );
    };
  }, []);

 

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const loadOfflineState = async () => {
      const saved = await isCourseOffline(
        String(id)
      );

      if (mounted) {
        setIsSavedOffline(saved);
      }
    };

    loadOfflineState();

    return () => {
      mounted = false;
    };
  }, [id]);

  

  useEffect(() => {
    if (!course) return;

    const reminder =
      getCourseReminder(course.id);

    setReminderOption(
      reminder?.option || "none"
    );

    setReminderMessage(
      reminder?.remindAt
        ? `Reminder set for ${new Date(
            reminder.remindAt
          ).toLocaleString()}.`
        : ""
    );
  }, [course]);

 

  useEffect(() => {
    if (!course) return;

    let mounted = true;

    const objectUrls: string[] = [];

    const loadCachedImages = async () => {
      const cachedMainImage =
        await getOfflineImageUrl(
          course.image
        );

      const cachedTestimonials: Record<
        number,
        string
      > = {};

      for (
        let index = 0;
        index < course.testimonials.length;
        index += 1
      ) {
        const image =
          await getOfflineImageUrl(
            course.testimonials[index].image
          );

        if (image) {
          cachedTestimonials[index] = image;
          objectUrls.push(image);
        }
      }

      if (!mounted) return;

      if (cachedMainImage) {
        objectUrls.push(cachedMainImage);

        setCourseImageSrc(
          cachedMainImage
        );
      } else {
        setCourseImageSrc(course.image);
      }

      setTestimonialImageSrc(
        cachedTestimonials
      );
    };

    setCourseImageSrc(course.image);
    setTestimonialImageSrc({});

    loadCachedImages();

    return () => {
      mounted = false;

      objectUrls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [course]);

 

  if (!course) {
    return (
      <div className="text-center text-red-500">
        Course not found!
      </div>
    );
  }

  const Module =
    course.modules[selectedmoduleindex];

  /* =========================================================
     NAVIGATION HANDLERS
  ========================================================= */

  const handlebackclick = () => {
    setshowmodulepage(false);
  };

  const handlemoduleclick = () => {
    recordDailyLearning();
    setshowmodulepage(true);
  };

  

  const handleOfflineToggle = async () => {
    if (!course || offlineSaving) return;

    setOfflineSaving(true);
    setOfflineMessage("");

    try {
      if (isSavedOffline) {
        await removeCourseOffline(
          course.id
        );

        setIsSavedOffline(false);

        setOfflineMessage(
          "Course removed from offline storage."
        );
      } else {
        if (!navigator.onLine) {
          setOfflineMessage(
            "Connect to the internet once to download this course for offline use."
          );

          return;
        }

        await saveCourseOffline(course);

        setIsSavedOffline(true);

        setOfflineMessage(
          "Course saved. Text and images are now available offline; videos are not downloaded."
        );
      }
    } catch {
      setOfflineMessage(
        "Could not update offline storage. Please try again while online."
      );
    } finally {
      setOfflineSaving(false);
    }
  };

  /* =========================================================
     REMINDER
  ========================================================= */

  const handleReminderChange = async (
    option: ReminderOption
  ) => {
    if (!course || reminderSaving) return;

    setReminderOption(option);
    setReminderSaving(true);
    setReminderMessage("");

    try {
      const result =
        await setCourseReminder(
          course.id,
          course.title,
          option
        );

      if (option === "none") {
        setReminderMessage(
          "Course reminders are turned off."
        );

        return;
      }

      if (result.permission === "denied") {
        setReminderOption("none");

        setReminderMessage(
          "Browser notifications are blocked. Allow notifications in your browser settings and try again."
        );

        return;
      }

      if (
        result.permission ===
        "unsupported"
      ) {
        setReminderOption("none");

        setReminderMessage(
          "This browser does not support notifications."
        );

        return;
      }

      if (result.reminder?.remindAt) {
        setReminderMessage(
          `Reminder set for ${new Date(
            result.reminder.remindAt
          ).toLocaleString()}.`
        );
      }
    } finally {
      setReminderSaving(false);
    }
  };

  

  const handleCompleteCourse = () => {
    if (courseCompleted) {
      return;
    }

    clearCourseReminder(
      course.id
    );

    setReminderOption("none");
    setReminderMessage("");

    setCourseCompleted(true);

    window.setTimeout(() => {
      setCourseCompleted(false);
    }, 5000);
  };

  

  if (showmodulepage) {
    const confettiColors = [
      "#0056D2",
      "#22C55E",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
    ];

    return (
      <div className="min-h-screen bg-white flex flex-col relative">

        {/* CONFETTI */}

        <style jsx>{`
          @keyframes confetti-fall {
            0% {
              transform: translate3d(
                0,
                -20vh,
                0
              ) rotate(0deg);
              opacity: 1;
            }

            100% {
              transform: translate3d(
                0,
                120vh,
                0
              ) rotate(720deg);
              opacity: 0;
            }
          }

          .confetti-piece {
            position: absolute;
            top: 0;
            border-radius: 2px;
            animation-name: confetti-fall;
            animation-duration: 4s;
            animation-timing-function: linear;
            animation-fill-mode: both;
          }

          @keyframes completion-pop {
            0% {
              opacity: 0;
              transform: scale(0.85)
                translateY(12px);
            }

            100% {
              opacity: 1;
              transform: scale(1)
                translateY(0);
            }
          }

          .completion-card {
            animation: completion-pop
              0.35s ease-out;
          }
        `}</style>

        {courseCompleted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({
                length: 80,
              }).map((_, index) => (
                <span
                  key={index}
                  className="confetti-piece"
                  style={{
                    left: `${
                      (index * 37) % 100
                    }%`,
                    animationDelay: `${
                      (index % 20) * 0.08
                    }s`,
                    width: `${
                      6 + (index % 5)
                    }px`,
                    height: `${
                      10 + (index % 7)
                    }px`,
                    backgroundColor:
                      confettiColors[
                        index %
                          confettiColors.length
                      ],
                    transform: `rotate(${
                      (index * 29) % 360
                    }deg)`,
                  }}
                />
              ))}
            </div>

            <div className="completion-card relative z-10 mx-4 w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                Great Job!
              </h2>

              <p className="mt-3 text-lg font-semibold text-gray-800">
                You’ve completed this course!
              </p>

              <p className="mt-2 text-gray-600">
                Keep learning, keep growing,
                and take on your next challenge.
              </p>

            </div>
          </div>
        )}

        {/* MODULE HEADER */}

        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center">

          <button
            onClick={handlebackclick}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />

            <span className="font-medium">
              Back to Courses
            </span>
          </button>

          <h1 className="text-xl font-semibold text-gray-800 ml-2">
            {course.title}
          </h1>

          <div className="ml-auto flex items-center gap-3">

            {!isOnline && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                <WifiOff size={14} />
                Offline mode
              </span>
            )}

            {isSavedOffline && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                <CheckCircle2 size={14} />
                Available Offline
              </span>
            )}

          </div>
        </header>

        {/* OFFLINE MESSAGE */}

        {offlineMessage && (
          <div className="border-b border-blue-100 bg-blue-50 px-6 py-3 text-sm text-blue-800">
            {offlineMessage}
          </div>
        )}

        {!isOnline &&
          isSavedOffline && (
            <div className="border-b border-amber-100 bg-amber-50 px-6 py-3 text-sm text-amber-800">
              You are offline. Course text
              and saved images are available.
              Videos are intentionally not
              downloaded.
            </div>
          )}

        <div className="flex flex-1 overflow-hidden">

          {/* MODULE SIDEBAR */}

          <div className="w-80 border-r border-gray-200 h-full overflow-y-auto flex-shrink-0">

            <div className="p-4 border-b border-gray-200">

              <h2 className="text-lg font-semibold text-gray-800">
                Course Modules
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Module{" "}
                {selectedmoduleindex + 1}{" "}
                of{" "}
                {course.modules.length}
              </p>

            </div>

            <nav className="py-2">

              {course.modules.map(
                (module, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setselectedmoduleindex(
                        index
                      );

                      setResumeRequest(0);
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedmoduleindex ===
                      index
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >

                    <div className="flex items-start">

                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          selectedmoduleindex ===
                          index
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div>

                        <h3
                          className={`font-medium ${
                            selectedmoduleindex ===
                            index
                              ? "text-blue-600"
                              : "text-gray-800"
                          }`}
                        >
                          {module.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {module.duration}
                        </p>

                      </div>

                    </div>

                  </button>
                )
              )}

            </nav>
          </div>

          {/* MODULE CONTENT */}

          <div className="flex-1 h-full overflow-y-auto bg-gray-50">

            <div className="max-w-full mx-auto p-6">

              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {Module.title}
                </h2>

                <div className="flex gap-4 mb-6">

                  <span className="text-sm text-gray-600 flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {Module.duration}
                  </span>

                  <span className="text-sm text-gray-600 flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {Module.hours} hours
                  </span>

                </div>

                {/* PREVIOUS / NEXT */}

                <div className="flex justify-between mb-6">

                  <button
                    onClick={() => {
                      setselectedmoduleindex(
                        Math.max(
                          0,
                          selectedmoduleindex -
                            1
                        )
                      );

                      setResumeRequest(0);
                    }}
                    disabled={
                      selectedmoduleindex ===
                      0
                    }
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedmoduleindex ===
                      0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Module
                  </button>

                  {selectedmoduleindex ===
                  course.modules.length - 1 ? (
                    <button
                      onClick={
                        handleCompleteCourse
                      }
                      disabled={
                        courseCompleted
                      }
                      className={`px-5 py-2 rounded-md flex items-center font-semibold transition-colors ${
                        courseCompleted
                          ? "bg-green-100 text-green-700 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />

                      {courseCompleted
                        ? "Course Completed"
                        : "Complete Course"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setselectedmoduleindex(
                          Math.min(
                            course.modules
                              .length - 1,
                            selectedmoduleindex +
                              1
                          )
                        );

                        setResumeRequest(0);
                      }}
                      className="px-4 py-2 rounded-md flex items-center bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Next Module

                      <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
                    </button>
                  )}

                </div>

                
                {Module.videoId && (
                  <div className="mb-8">

                    {resumeTime > 5 && (
                      <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">

                        <div>

                          <p className="font-semibold text-gray-800">
                            Continue where you
                            left off
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            Resume from{" "}
                            {Math.floor(
                              resumeTime / 60
                            )}
                            :
                            {String(
                              Math.floor(
                                resumeTime % 60
                              )
                            ).padStart(
                              2,
                              "0"
                            )}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            console.log(
                              "Resuming video at:",
                              resumeTime
                            );
                            setResumeRequest(0)
                              setTimeout(()=>{
                                setResumeRequest(resumeTime);
                              },50);
                            
                            }}
                          className="px-5 py-2 bg-[#0056D2] text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Resume Watching
                        </button>

                      </div>
                    )}

                    <Videolayer
                      key={`${course.id}-${Module.videoId}`}
                      videoId={
                        Module.videoId
                      }
                      title={Module.title}
                      courseId={course.id}
                      resumeRequest={
                        resumeRequest
                      }
                    />

                  </div>
                )}

              </div>

              {/* ABOUT MODULE */}

              <div className="bg-white rounded-xl shadow-sm p-6">

                <h3 className="text-xl font-semibold mb-4">
                  About this module
                </h3>

                <p className="text-gray-700 mb-8">
                  {Module.description}
                </p>

                <h4 className="font-medium text-gray-800 mb-4">
                  Module Details
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-800">
                        Duration
                      </h4>
                    </div>

                    <p className="text-gray-600">
                      {Module.weeks} weeks
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />

                      <h4 className="font-medium text-gray-800">
                        Study Hours
                      </h4>
                    </div>

                    <p className="text-gray-600">
                      {Module.hours} hours
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />

                      <h4 className="font-medium text-gray-800">
                        Projects
                      </h4>
                    </div>

                    <p className="text-gray-600">
                      {Module.projects} projects
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />

                      <h4 className="font-medium text-gray-800">
                        Quizzes
                      </h4>
                    </div>

                    <p className="text-gray-600">
                      {Module.quizzes} quizzes
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  

  const fullDescription = `
    Prepare for a career in the high-growth field of data analytics, no experience or degree required.
    Get professional training designed by Google and have the opportunity to connect with top employers.

    Data analytics is the collection, transformation, and organization of data in order to draw conclusions,
    make predictions, and drive informed decision making. Over 8 courses, gain in-demand skills that prepare
    you for an entry-level job. You'll learn from Google employees whose foundations in data analytics
    served as launchpads for their own careers.

    This program includes over 180 hours of instruction and hundreds of practice-based assessments, which
    will help you simulate real-world data analytics scenarios that are critical for success in the workplace.
    The content is highly interactive and exclusively developed by Google employees with decades of
    experience in data analytics. Through a mix of videos, assessments, and hands-on labs, you'll get
    introduced to analysis tools and platforms and key analytical skills required for an entry-level job.
  `;

  
  return (
    <div className="min-h-screen bg-white">

      {/* STICKY NAVIGATION */}

      <div className="sticky top-0 bg-white border-b z-50">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-center justify-between h-16">

            <div className="flex items-center space-x-8">

              <a
                href="#overview"
                className="text-gray-700 hover:text-[#0056D2]"
              >
                Overview
              </a>

              <a
                href="#skills"
                className="text-gray-700 hover:text-[#0056D2]"
              >
                Skills
              </a>

              <a
                href="#content"
                className="text-gray-700 hover:text-[#0056D2]"
              >
                Content
              </a>

              <a
                href="#instructors"
                className="text-gray-700 hover:text-[#0056D2]"
              >
                Instructors
              </a>

              <a
                href="#reviews"
                className="text-gray-700 hover:text-[#0056D2]"
              >
                Reviews
              </a>

              <a
                href="#careers"
                className="text-gray-700 hover:text-[#0056D2]"
              >
                Career Outcomes
              </a>

            </div>

            <button
              className="px-6 py-2 bg-[#0056D2] text-white font-semibold rounded-sm"
              onClick={handlemoduleclick}
            >
              Enroll Now
            </button>

          </div>

        </div>
      </div>

      {/* COURSE HEADER */}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-start justify-between">

            <div className="max-w-2xl">

              <div className="flex items-center space-x-4 mb-4">

                <div className="flex items-center">

                  <span className="ml-1 text-gray-600">
                    {course.type}
                  </span>

                </div>

                <div className="flex items-center text-yellow-500">

                  <Star className="h-5 w-5 fill-current" />

                  <span className="ml-1 font-semibold text-gray-900">
                    {course.rating}
                  </span>

                </div>

              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">

                {showFullDescription
                  ? fullDescription
                  : fullDescription.slice(
                      0,
                      200
                    ) + "..."}

                <button
                  onClick={() =>
                    setShowFullDescription(
                      !showFullDescription
                    )
                  }
                  className="text-[#0056D2] ml-2 hover:underline"
                >
                  {showFullDescription
                    ? "Show less"
                    : "Read more"}
                </button>

              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500" />

                  <span className="ml-2">
                    {course.students}
                  </span>
                </div>

                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-500" />

                  <span className="ml-2">
                    {course.level}
                  </span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500" />

                  <span className="ml-2">
                    {course.timeline}
                  </span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500" />

                  <span className="ml-2">
                    Updated{" "}
                    {course.lastUpdated}
                  </span>
                </div>

              </div>

              {/* ACTION BUTTONS */}

              <div className="flex items-center space-x-4 mb-8">

                <button
                  className="px-8 py-3 bg-[#0056D2] text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors"
                  onClick={
                    handlemoduleclick
                  }
                >
                  Start Free Trial
                </button>

                {/* OFFLINE */}

                <button
                  type="button"
                  onClick={
                    handleOfflineToggle
                  }
                  disabled={
                    offlineSaving
                  }
                  className={`px-6 py-3 rounded-sm font-semibold transition-colors inline-flex items-center gap-2 disabled:opacity-60 ${
                    isSavedOffline
                      ? "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >

                  {offlineSaving ? (
                    <span className="animate-pulse">
                      Saving...
                    </span>
                  ) : isSavedOffline ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />

                      Available Offline
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />

                      Save Offline
                    </>
                  )}

                </button>

                {/* REMINDER */}

                <div
                  className={`flex items-center gap-2 rounded-sm border px-3 py-1.5 bg-white transition-colors ${
                    reminderOption !==
                    "none"
                      ? "border-amber-300 bg-amber-50"
                      : "border-gray-300"
                  }`}
                >

                  <Bell
                    className={`h-5 w-5 shrink-0 ${
                      reminderOption !==
                      "none"
                        ? "text-amber-600"
                        : "text-gray-600"
                    }`}
                  />

                  <div className="flex flex-col leading-tight">

                    <span className="text-xs font-semibold text-gray-500">
                      Course Reminder
                    </span>

                    <select
                      value={
                        reminderOption
                      }
                      onChange={(event) =>
                        handleReminderChange(
                          event.target
                            .value as ReminderOption
                        )
                      }
                      disabled={
                        reminderSaving ||
                        courseCompleted
                      }
                      className="min-w-[190px] border-0 bg-transparent p-0 text-sm font-semibold text-gray-800 outline-none focus:ring-0 disabled:opacity-60"
                      aria-label="Course reminder"
                    >
                      <option value="none">
                        No reminders
                      </option>

                      <option value="1-hour">
                        Remind me in 1 hour
                      </option>

                      <option value="tomorrow">
                        Remind me tomorrow
                      </option>
                    </select>

                  </div>
                </div>

                {/* BOOKMARK / SHARE */}

                <div className="flex items-center space-x-4">

                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <BookmarkPlus className="h-6 w-6 text-gray-600" />
                  </button>

                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="h-6 w-6 text-gray-600" />
                  </button>

                </div>

              </div>

              {/* MESSAGES */}

              {offlineMessage && (
                <p className="mb-4 text-sm text-blue-700">
                  {offlineMessage}
                </p>
              )}

              {reminderMessage && (
                <p className="mb-4 flex items-center gap-2 text-sm text-amber-700">

                  {reminderOption ===
                  "none" ? (
                    <BellOff className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}

                  {reminderMessage}

                </p>
              )}

              {/* LANGUAGES */}

              <div className="flex items-center space-x-4">

                <Globe className="h-5 w-5 text-gray-500" />

                <div className="flex items-center space-x-2">

                  {course.languages.map(
                    (lang, index) => (
                      <span
                        key={index}
                        className="text-sm text-gray-600"
                      >
                        {lang}

                        {index <
                        course.languages
                          .length -
                          1
                          ? ","
                          : ""}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* COURSE PREVIEW CARD */}

            <div className="w-[400px]">

              <div className="bg-white rounded-lg shadow-xl overflow-hidden sticky top-24">

                <div className="relative">

                  <img
                    src={
                      courseImageSrc ||
                      course.image
                    }
                    alt="Course Preview"
                    className="w-full h-[225px] object-cover"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">

                    <PlayCircle className="h-16 w-16 text-white cursor-pointer hover:scale-110 transition-transform" />

                  </div>

                </div>

                <div className="p-6">

                  <div className="mb-6">

                    <div className="flex justify-between items-center mb-2">

                      <span className="text-2xl font-bold">
                        {course.price.monthly}
                      </span>

                      <span className="text-gray-500 line-through">
                        {course.price.fullCourse}
                      </span>

                    </div>

                    <p className="text-sm text-gray-600">
                      7-day free trial •
                      Cancel anytime
                    </p>

                  </div>

                  <button
                    className="w-full px-4 py-3 bg-[#0056D2] text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors mb-4"
                    onClick={
                      handlemoduleclick
                    }
                  >
                    Start Free Trial
                  </button>

                  <div className="space-y-3 text-sm">

                    <div className="flex items-center text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      Shareable Certificate upon completion
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Globe className="h-5 w-5 text-green-500 mr-2" />
                      100% online and flexible schedule
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Target className="h-5 w-5 text-green-500 mr-2" />
                      Beginner-friendly, no prerequisites
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Briefcase className="h-5 w-5 text-green-500 mr-2" />
                      Real-world projects included
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CAREER OUTCOMES */}

      <div className="py-12 bg-white">

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-2xl font-bold mb-8">
            Career Outcomes
          </h2>

          <div className="grid grid-cols-3 gap-8">

            {course.careerOutcomes.map(
              (outcome, index) => {

                const IconComponent =
                  outcome.icon;

                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >

                    {IconComponent && (
                      <IconComponent
                        className="h-8 w-8 text-[#0056D2] mb-4"
                      />
                    )}

                    <h3 className="text-lg font-semibold mb-2">
                      {outcome.title}
                    </h3>

                    <p className="text-2xl font-bold text-[#0056D2]">
                      {outcome.value}
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

      {/* SKILLS */}

      <div
        id="skills"
        className="py-12 bg-gray-50"
      >

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-2xl font-bold mb-6">
            Skills you'll gain
          </h2>

          <div className="flex flex-wrap gap-3">

            {course.skills.map(
              (skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm hover:border-[#0056D2] hover:text-[#0056D2] transition-colors cursor-pointer"
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

      </div>

      {/* COURSE CONTENT */}

      <div
        id="content"
        className="py-12 bg-white"
      >

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-2xl font-bold">
              Course Content
            </h2>

            <div className="text-gray-600">

              <span className="font-semibold">
                {course.modules.length}
              </span>{" "}
              modules •{" "}

              <span className="font-semibold">
                180+
              </span>{" "}
              hours •{" "}

              <span className="font-semibold">
                25
              </span>{" "}
              hands-on projects

            </div>

          </div>

          <div className="space-y-4">

            {course.modules.map(
              (module, index) => (

                <div
                  key={index}
                  className={`bg-white border rounded-lg overflow-hidden transition-shadow hover:shadow-md ${
                    selectedModule ===
                    index
                      ? "border-[#0056D2]"
                      : "border-gray-200"
                  }`}
                >

                  <button
                    className="w-full p-6 text-left"
                    onClick={() =>
                      setSelectedModule(
                        selectedModule ===
                        index
                          ? -1
                          : index
                      )
                    }
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex items-start flex-1">

                        <div className="flex-shrink-0">

                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-[#0056D2] font-semibold">
                            {index + 1}
                          </div>

                        </div>

                        <div className="ml-4">

                          <h3 className="font-semibold text-lg mb-1">
                            {module.title}
                          </h3>

                          <p className="text-sm text-gray-500 mb-2">
                            {module.duration}
                          </p>

                          <p className="text-gray-600">
                            {module.description}
                          </p>

                        </div>

                      </div>

                      <ChevronDown
                        className={`h-6 w-6 text-gray-400 transform transition-transform ${
                          selectedModule ===
                          index
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </div>

                  </button>

                  {selectedModule ===
                    index && (
                    <div className="px-6 pb-6 pt-2 border-t">

                      <div className="grid grid-cols-4 gap-4">

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Duration
                          </p>

                          <p className="font-semibold">
                            {module.weeks}{" "}
                            weeks
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Learning Hours
                          </p>

                          <p className="font-semibold">
                            {module.hours}{" "}
                            hours
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Projects
                          </p>

                          <p className="font-semibold">
                            {module.projects}{" "}
                            hands-on
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">
                            Assessments
                          </p>

                          <p className="font-semibold">
                            {module.quizzes}{" "}
                            quizzes
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              )
            )}

          </div>

        </div>

      </div>

      {/* TESTIMONIALS */}

      <div
        id="reviews"
        className="py-12 bg-gray-50"
      >

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-2xl font-bold mb-8">
            Learner Success Stories
          </h2>

          <div className="grid grid-cols-2 gap-8">

            {course.testimonials.map(
              (testimonial, index) => (

                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >

                  <div className="flex items-start space-x-4 mb-4">

                    <img
                      src={
                        testimonialImageSrc[
                          index
                        ] ||
                        testimonial.image
                      }
                      alt={
                        testimonial.author
                      }
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>

                      <h3 className="font-semibold text-lg">
                        {testimonial.author}
                      </h3>

                      <p className="text-gray-600">
                        {testimonial.role}
                      </p>

                      <p className="text-sm text-[#0056D2]">
                        {testimonial.impact}
                      </p>

                    </div>

                  </div>

                  <blockquote className="text-gray-600 italic">
                    "{testimonial.quote}"
                  </blockquote>

                </div>

              )
            )}

          </div>

        </div>

      </div>

      {/* FAQ */}

      <div className="py-12 bg-white">

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-2xl font-bold mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-2 gap-8">

            <div className="space-y-4">

              <div className="border rounded-lg p-4">

                <h3 className="font-semibold mb-2">
                  Do I need prior experience?
                </h3>

                <p className="text-gray-600">
                  No prior experience is
                  required. This program is
                  designed for beginners and
                  will teach you everything
                  from the ground up.
                </p>

              </div>

              <div className="border rounded-lg p-4">

                <h3 className="font-semibold mb-2">
                  How long does it take to
                  complete?
                </h3>

                <p className="text-gray-600">
                  The program typically takes
                  6 months to complete with 10
                  hours/week of study. You can
                  learn at your own pace and
                  adjust the schedule to your
                  needs.
                </p>

              </div>

            </div>

            <div className="space-y-4">

              <div className="border rounded-lg p-4">

                <h3 className="font-semibold mb-2">
                  What kind of support is
                  available?
                </h3>

                <p className="text-gray-600">
                  You'll have access to a
                  global learner community,
                  course mentors, and technical
                  support throughout your
                  learning journey.
                </p>

              </div>

              <div className="border rounded-lg p-4">

                <h3 className="font-semibold mb-2">
                  Is the certificate
                  recognized?
                </h3>

                <p className="text-gray-600">
                  Yes, upon completion you'll
                  receive an industry-recognized
                  certificate that you can share
                  with prospective employers.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FINAL CTA */}

      <div className="bg-[#0056D2] text-white py-16">

        <div className="max-w-7xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Learning
            Journey?
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            Start learning today and build
            your career.
          </p>

          <button
            onClick={handlemoduleclick}
            className="px-8 py-3 bg-white text-[#0056D2] font-semibold rounded-sm hover:bg-gray-100 transition-colors"
          >
            Enroll Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default CourseDetails;