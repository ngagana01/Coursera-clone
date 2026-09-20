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
  MessageCircle,
  ThumbsUp,
  AlignCenterVertical as Certificate,
  Calendar,
  Target,
  ChevronDown,
  Briefcase,
  Building2,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useRouter } from "next/router";
import { Course, courses } from "@/Components/data/constant";
import Videolayer from "@/Components/Videolayer";

function CourseDetails() {
  const [selectedModule, setSelectedModule] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedmoduleindex, setselectedmoduleindex] = useState(0);
  const [showmodulepage, setshowmodulepage] = useState(false);
  const router = useRouter();
  const { id } = router.query; // Get course ID from route
  const [course, setCourse] = useState<Course | null>(null);
  useEffect(() => {
    if (id) {
      const foundCourse = courses.find((c) => c.id === id);
      setCourse(foundCourse || null);
    }
  }, [id]);
  if (!course) {
    return <div className="text-center text-red-500">Course not found!</div>;
  }
  const Module = course.modules[selectedmoduleindex];
  const handlebackclick = () => {
    setshowmodulepage(false);
  };
  const handlemoduleclick = () => {
    setshowmodulepage(true);
  };

  if (showmodulepage) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center">
          <button
            onClick={handlebackclick}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Courses</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-2">
            {course.title}
          </h1>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 border-r border-gray-200 h-full overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Course Modules
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Module {selectedmoduleindex + 1} of {course.modules.length}
              </p>
            </div>
            <nav className="py-2">
              {course.modules.map((module, index) => (
                <button
                  key={index}
                  onClick={() => setselectedmoduleindex(index)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedmoduleindex === index ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        selectedmoduleindex === index
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3
                        className={`font-medium ${
                          selectedmoduleindex === index
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
              ))}
            </nav>
          </div>

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

                <div className="flex justify-between mb-6">
                  <button
                    onClick={() =>
                      setselectedmoduleindex(
                        Math.max(0, selectedmoduleindex - 1)
                      )
                    }
                    disabled={selectedmoduleindex === 0}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedmoduleindex === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Module
                  </button>
                  <button
                    onClick={() =>
                      setselectedmoduleindex(
                        Math.min(
                          course.modules.length - 1,
                          selectedmoduleindex + 1
                        )
                      )
                    }
                    disabled={selectedmoduleindex === course.modules.length - 1}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedmoduleindex === course.modules.length - 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next Module
                    <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
                  </button>
                </div>
                {Module.videoId && (
                  <div className="mb-8">
                    <Videolayer videoId={Module.videoId} title={Module.title} />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">
                  About this module
                </h3>
                <p className="text-gray-700 mb-8">{Module.description}</p>

                <h4 className="font-medium text-gray-800 mb-4">
                  Module Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-800">Duration</h4>
                    </div>
                    <p className="text-gray-600">{Module.weeks} weeks</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-800">Study Hours</h4>
                    </div>
                    <p className="text-gray-600">{Module.hours} hours</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-800">Projects</h4>
                    </div>
                    <p className="text-gray-600">{Module.projects} projects</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-800">Quizzes</h4>
                    </div>
                    <p className="text-gray-600">{Module.quizzes} quizzes</p>
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
      {/* Sticky Navigation Bar */}
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
              <a href="#skills" className="text-gray-700 hover:text-[#0056D2]">
                Skills
              </a>
              <a href="#content" className="text-gray-700 hover:text-[#0056D2]">
                Content
              </a>
              <a
                href="#instructors"
                className="text-gray-700 hover:text-[#0056D2]"
              >
                Instructors
              </a>
              <a href="#reviews" className="text-gray-700 hover:text-[#0056D2]">
                Reviews
              </a>
              <a href="#careers" className="text-gray-700 hover:text-[#0056D2]">
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

      {/* Course Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Certificate className="h-5 w-5 text-[#0056D2]" />
                  <span className="ml-1 text-gray-600">{course.type}</span>
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
                  : fullDescription.slice(0, 200) + "..."}
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#0056D2] ml-2 hover:underline"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">{course.students}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">{course.level}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">{course.timeline}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Updated {course.lastUpdated}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <button
                  className="px-8 py-3 bg-[#0056D2] text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors"
                  onClick={handlemoduleclick}
                >
                  Start Free Trial
                </button>
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <BookmarkPlus className="h-6 w-6 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Globe className="h-5 w-5 text-gray-500" />
                <div className="flex items-center space-x-2">
                  {course.languages.map((lang, index) => (
                    <span key={index} className="text-sm text-gray-600">
                      {lang}
                      {index < course.languages.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-[400px]">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden sticky top-24">
                <div className="relative">
                  <img
                    src={course.image}
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
                      7-day free trial • Cancel anytime
                    </p>
                  </div>

                  <button
                    className="w-full px-4 py-3 bg-[#0056D2] text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors mb-4"
                    onClick={handlemoduleclick}
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

      {/* Career Outcomes */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Career Outcomes</h2>
          <div className="grid grid-cols-3 gap-8">
            {course.careerOutcomes.map((outcome, index) => {
              const IconComponent = outcome.icon; // Now it's already a React component

              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {IconComponent && (
                    <IconComponent className="h-8 w-8 text-[#0056D2] mb-4" />
                  )}
                  <h3 className="text-lg font-semibold mb-2">
                    {outcome.title}
                  </h3>
                  <p className="text-2xl font-bold text-[#0056D2]">
                    {outcome.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills You'll Gain */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Skills you'll gain</h2>
          <div className="flex flex-wrap gap-3">
            {course.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm hover:border-[#0056D2] hover:text-[#0056D2] transition-colors cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <div className="text-gray-600">
              <span className="font-semibold">8</span> modules •
              <span className="font-semibold"> 180+</span> hours •
              <span className="font-semibold"> 25</span> hands-on projects
            </div>
          </div>

          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div
                key={index}
                className={`bg-white border rounded-lg overflow-hidden transition-shadow hover:shadow-md
                  ${
                    selectedModule === index
                      ? "border-[#0056D2]"
                      : "border-gray-200"
                  }`}
              >
                <button
                  className="w-full p-6 text-left"
                  onClick={() =>
                    setSelectedModule(selectedModule === index ? -1 : index)
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
                        <p className="text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-6 w-6 text-gray-400 transform transition-transform
                        ${selectedModule === index ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {selectedModule === index && (
                  <div className="px-6 pb-6 pt-2 border-t">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{module.weeks} weeks</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Learning Hours</p>
                        <p className="font-semibold">{module.hours} hours</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Projects</p>
                        <p className="font-semibold">
                          {module.projects} hands-on
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Assessments</p>
                        <p className="font-semibold">
                          {module.quizzes} quizzes
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Learner Success Stories</h2>
          <div className="grid grid-cols-2 gap-8">
            {course.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {testimonial.author}
                    </h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-[#0056D2]">
                      {testimonial.impact}
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
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
                  No prior experience is required. This program is designed for
                  beginners and will teach you everything from the ground up.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  How long does it take to complete?
                </h3>
                <p className="text-gray-600">
                  The program typically takes 6 months to complete with 10
                  hours/week of study. You can learn at your own pace and adjust
                  the schedule to your needs.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  What kind of support is available?
                </h3>
                <p className="text-gray-600">
                  You'll have access to a global learner community, course
                  mentors, and technical support throughout your learning
                  journey.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  Is the certificate recognized?
                </h3>
                <p className="text-gray-600">
                  Yes, upon completion you'll receive an industry-recognized
                  certificate from Google that you can share with prospective
                  employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Learning CTA */}
      <div className="bg-[#0056D2] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Data Analytics Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1.7M+ learners and launch your career in data analytics
          </p>
          <button className="px-8 py-3 bg-white text-[#0056D2] font-semibold rounded-sm hover:bg-gray-100 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
