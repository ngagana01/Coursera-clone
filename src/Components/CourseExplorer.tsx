

import React, { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, Download, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { courseSummaries } from "@/Components/data/courseCatalog";
import {
  getOfflineCourseIds,
  isCourseOffline,
  removeCourseOffline,
  saveCourseOffline,
} from "@/lib/offlineCourse";


const availableTags = [
  "All",
  "Programming",
  "Web Development",
  "Backend",
  "Database",
  "Design",
  "AI & ML",
  "Data Science",
  "Business",
  "Management",
  "Marketing",
];

const CourseExplorer = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [offlineCourses, setOfflineCourses] = useState<Record<string, boolean>>({});
  const [downloadingCourseId, setDownloadingCourseId] = useState<string | null>(null);
  const [offlineMessage, setOfflineMessage] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const loadOfflineCourses = async () => {
      const ids = await getOfflineCourseIds();
      if (!mounted) return;

      const map: Record<string, boolean> = {};
      ids.forEach((id) => {
        map[id] = true;
      });
      setOfflineCourses(map);
    };

    loadOfflineCourses();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!offlineMessage) return;

    const timer = window.setTimeout(() => setOfflineMessage(""), 3500);
    return () => window.clearTimeout(timer);
  }, [offlineMessage]);

  const handleOfflineToggle = async (
    event: React.MouseEvent,
    course: (typeof courseSummaries)[number]
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (downloadingCourseId) return;

    setDownloadingCourseId(course.id);
    setOfflineMessage("");

    try {
      if (offlineCourses[course.id]) {
        await removeCourseOffline(course.id);
        setOfflineCourses((previous) => ({ ...previous, [course.id]: false }));
        setOfflineMessage(`${course.title} removed from offline storage.`);
        return;
      }

      // Every course card comes from the same course catalog, so every course
      // follows the same IndexedDB download path. Videos are never stored.
      await saveCourseOffline(course);

      const saved = await isCourseOffline(course.id);
      setOfflineCourses((previous) => ({ ...previous, [course.id]: saved }));
      setOfflineMessage(
        saved
          ? `${course.title} is now available offline.`
          : `Could not save ${course.title} for offline use.`
      );
    } catch {
      setOfflineMessage(`Could not save ${course.title}. Please try again while online.`);
    } finally {
      setDownloadingCourseId(null);
    }
  };



  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const search = router.query.search;
    const tag = router.query.tag;


    if (typeof search === "string") {
      setSearchTerm(search);
    } else {
      setSearchTerm("");
    }
    if (typeof tag === "string") {
    setSelectedTag(tag);
  } else {
    setSelectedTag("All");
  }

  }, [router.isReady, router.query.search, router.query.tag]);

  

  const filteredCourses = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return courseSummaries.filter((course) => {
      const matchesSearch =
        search === "" ||
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search);

      const matchesTag =
        selectedTag === "All" ||
        course.tags.some(
          (tag) =>
            tag.toLowerCase() ===
            selectedTag.toLowerCase()
        );

      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setSearchTerm(value);

    router.replace(
      {
        pathname: "/",
        query: value
          ? { search: value }
          : {},
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("All");

    router.replace(
      {
        pathname: "/",
        query: {},
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <section
      id="course-explorer"
      className="bg-gray-50 py-16"
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Explore Courses
          </h2>

          <p className="text-gray-600 mt-2">
            Search and discover courses based on your
            interests.
          </p>

        </div>

        {/* SEARCH */}

        <div className="relative max-w-3xl mb-8">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={22}
          />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search courses by title or description..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#0056D2]
                       focus:border-[#0056D2] shadow-sm"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearFilters}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}

        </div>

        {/* TAG FILTER */}

        <div className="mb-10">

          <div className="flex items-center gap-2 mb-4">

            <SlidersHorizontal
              size={18}
              className="text-gray-600"
            />

            <span className="font-semibold text-gray-800">
              Filter by topic
            </span>

          </div>

          <div className="flex flex-wrap gap-3">

            {availableTags.map((tag) => {

              const selected =
                selectedTag === tag;

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
  setSelectedTag(tag);

  router.replace(
    {
      pathname: "/",
      query: {
        ...(searchTerm.trim()
          ? { search: searchTerm }
          : {}),
        ...(tag !== "All"
          ? { tag }
          : {}),
      },
    },
    undefined,
    {
      shallow: true,
    }
  );
}}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    selected
                      ? "bg-[#0056D2] text-white border-[#0056D2]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#0056D2] hover:text-[#0056D2]"
                  }`}
                >
                  {tag}
                </button>
              );
            })}

          </div>

        </div>

        {offlineMessage && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {offlineMessage}
          </div>
        )}

        {/* RESULT COUNT */}

        <div className="flex justify-between items-center mb-6">

          <p className="text-gray-600">

            <span className="font-semibold text-gray-900">
              {filteredCourses.length}
            </span>

            {" "}

            {filteredCourses.length === 1
              ? "course"
              : "courses"}{" "}
            found

          </p>

          {(searchTerm ||
            selectedTag !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[#0056D2] font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}

        </div>

        {/* COURSES */}

        {filteredCourses.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredCourses.map((course) => (

              <div
                key={course.id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative"
              >
                <Link href={`/course/${course.id}`} className="block">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-44 object-cover"
                    />
                    {offlineCourses[course.id] && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow">
                        <CheckCircle2 size={14} />
                        Available Offline
                      </span>
                    )}
                  </div>

                  <div className="p-5 pb-3">
                    <p className="text-sm text-gray-500 mb-2">
                      {course.provider}
                    </p>

                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-[#0056D2] text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500">
                      {course.type}
                    </p>
                  </div>
                </Link>

                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={(event) => handleOfflineToggle(event, course)}
                    disabled={downloadingCourseId === course.id}
                    className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 ${
                      offlineCourses[course.id]
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                        : "bg-[#0056D2] text-white hover:bg-blue-700"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {downloadingCourseId === course.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : offlineCourses[course.id] ? (
                      <>
                        <Trash2 size={16} />
                        Remove Offline
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Save Offline
                      </>
                    )}
                  </button>
                </div>
              </div>

            ))}

          </div>

        ) : (

          /* NO RESULTS */

          <div className="bg-white border rounded-lg py-16 text-center">

            <div className="text-5xl mb-4">
              🔎
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No courses found
            </h3>

            <p className="text-gray-600 mb-6">
              Try another search term or select a
              different topic.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-3 bg-[#0056D2] text-white rounded-md font-semibold hover:bg-blue-700"
            >
              Clear filters
            </button>

          </div>

        )}

      </div>
    </section>
  );
};

export default CourseExplorer;