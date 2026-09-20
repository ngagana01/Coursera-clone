import { BookOpen, ChevronDown, Globe, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [user, setuser] = useState<{
    name: string;
    email: string;
    image: string;
  } | null>(null);
  const [isloggedin, setisloggedin] = useState(false);
  const [issearchfocused, setissearchfocused] = useState(false);
  const [isexploremenuopen, setisexploremenuopen] = useState(false);
  const [isdegreemenuopen, setisdegreemenuopen] = useState(false);
  const [isusermenuopen, setisusermenuopen] = useState(false);
  const topNav = [
    "For Individuals",
    "For Businesses",
    "For Universities",
    "For Governments",
  ];

  const exploreMenuItems = [
    {
      category: "Goals",
      items: [
        {
          title: "Take a Free Course",
          description: "Learn from top universities for free",
        },
        {
          title: "Earn a Degree",
          description: "Get a degree from a top university",
        },
        {
          title: "Earn a Certificate",
          description: "Professional certificates from companies",
        },
        {
          title: "Advance Your Career",
          description: "Learn skills to boost your career",
        },
      ],
    },
    {
      category: "Subjects",
      items: [
        {
          title: "Data Science",
          description: "Learn data analysis and visualization",
        },
        {
          title: "Business",
          description: "Develop business management skills",
        },
        {
          title: "Computer Science",
          description: "Learn programming and software development",
        },
        {
          title: "Information Technology",
          description: "Master IT and cloud computing",
        },
      ],
    },
  ];

  const degreesMenuItems = [
    { title: "Bachelor's Degrees", count: "15+ Degrees" },
    { title: "Master's Degrees", count: "25+ Degrees" },
    { title: "Graduate Certificates", count: "10+ Certificates" },
    { title: "Professional Degrees", count: "5+ Degrees" },
  ];

  const handlegooglesignin = () => {
    setisloggedin(true);
    setuser({
      name: "John Doe",
      email: "Johnn.doe@example.com",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80",
    });
  };
  const handlelogout = () => {
    setisloggedin(false);
    setuser(null);
  };
  return (
    <>
      <div className="bg-[#1F2937] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">English</span>
            </div>
            <div className="flex space-x-6">
              {topNav.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm hover:text-gray-300 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-[#0056D2] cursor-pointer">
                <BookOpen className="h-8 w-8" />
                <span className="ml-2 font-bold text-xl tracking-tight">
                  Course
                </span>
              </div>

              <div className="relative">
                <button
                  className="text-[#0056D2] font-semibold flex items-center hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setisexploremenuopen(!isexploremenuopen);
                    setisdegreemenuopen(false);
                  }}
                >
                  Explore
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                      isexploremenuopen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isexploremenuopen && (
                  <div className="absolute top-full left-0 w-[600px] bg-white shadow-lg rounded-md mt-2 p-6 grid grid-cols-2 gap-8">
                    {exploreMenuItems.map((section, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 mb-4">
                          {section.category}
                        </h3>
                        <div className="space-y-4">
                          {section.items.map((item, itemIndex) => (
                            <a key={itemIndex} href="#" className="block group">
                              <div className="text-gray-900 font-medium group-hover:text-[#0056D2]">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.description}
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  className={`w-[400px] pl-10 pr-4 py-2 border rounded-sm transition-all duration-200 ${
                    issearchfocused
                      ? "border-[#0056D2] shadow-sm"
                      : "border-gray-300"
                  }`}
                  onFocus={() => setissearchfocused(true)}
                  onBlur={() => setissearchfocused(false)}
                />
                <Search
                  className={`absolute left-3 top-2.5 h-5 w-5 transition-colors duration-200 ${
                    issearchfocused ? "text-[#0056D2]" : "text-gray-400"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button
                  className="text-[#0056D2] font-semibold hover:opacity-80 transition-opacity flex items-center"
                  onClick={() => {
                    setisdegreemenuopen(!isdegreemenuopen);
                    setisexploremenuopen(false);
                  }}
                >
                  Online Degree
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                      isdegreemenuopen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isdegreemenuopen && (
                  <div className="absolute top-full right-0 w-[300px] bg-white shadow-lg rounded-md mt-2 p-4">
                    {degreesMenuItems.map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md group"
                      >
                        <span className="text-gray-900 group-hover:text-[#0056D2]">
                          {item.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.count}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {isloggedin ? (
                <div className="relative">
                  <button
                    className="flex items-center space-x-2"
                    onClick={() => setisusermenuopen(!isusermenuopen)}
                  >
                    <img
                      src={user?.image}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isusermenuopen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isusermenuopen && (
                    <div className="absolute top-full right-0 w-[250px] bg-white shadow-lg rounded-md mt-2 py-2">
                      <Link href={`/profile`} className="block">
                        <div className="px-4 py-3 border-b cursor-pointer hover:bg-gray-100 transition">
                          <div className="font-medium text-gray-900">
                            {user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.email}
                          </div>
                        </div>
                      </Link>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        My Courses
                      </a>
                      <a
                        href="/certificate"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        My Certificates
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Settings
                      </a>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={handlelogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={handlegooglesignin}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-sm text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="google"
                      className="w-4 h-4"
                    />
                    <span>Sign in with Google</span>
                  </button>
                  <button className="px-4 py-2 bg-[#0056D2] text-white font-semibold rounded-sm hover:bg-blue-700 transition-colors">
                    Join for Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
