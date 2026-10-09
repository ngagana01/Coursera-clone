
import React, { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronDown, Globe, Search, X, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { recordDailyLearning } from "@/lib/streak";

const Navbar = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<{
    name: string;
    email: string;
    image: string;
  } | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isDegreeOpen, setIsDegreeOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const query = router.query.search;
    setSearchTerm(typeof query === "string" ? query : "");
  }, [router.query.search]);

  const exploreItems = [
    { title: "Take a Free Course", description: "Learn from top universities for free" },
    { title: "Earn a Degree", description: "Get a degree from a top university" },
    { title: "Earn a Certificate", description: "Professional certificates from companies" },
    { title: "Advance Your Career", description: "Learn skills to boost your career" },
    { title: "Data Science", description: "Learn data analysis and visualization" },
    { title: "Business", description: "Develop business management skills" },
    { title: "Computer Science", description: "Programming and software development" },
    { title: "Information Technology", description: "IT and cloud computing" },
  ];

  const degreeItems = [
    { title: "Bachelor's Degrees", count: "15+ Degrees" },
    { title: "Master's Degrees", count: "25+ Degrees" },
    { title: "Graduate Certificates", count: "10+ Certificates" },
    { title: "Professional Degrees", count: "5+ Degrees" },
  ];

  const updateSearch = (value: string) => {
    setSearchTerm(value);
    void router.replace(
      { pathname: "/", query: value.trim() ? { search: value } : {} },
      undefined,
      { shallow: true }
    );
  };

  const handleSearch = () => {
    void router.push({
      pathname: "/",
      query: searchTerm.trim() ? { search: searchTerm.trim() } : {},
    });
    setIsMobileSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    void router.push("/");
    searchRef.current?.focus();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
    if (event.key === "Escape") setIsMobileSearchOpen(false);
  };

  const handleSignIn = () => {
    setIsLoggedIn(true);
    recordDailyLearning();
    setUser({
      name: "John Doe",
      email: "john.doe@example.com",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setIsUserOpen(false);
  };

  const closeMenus = () => {
    setIsExploreOpen(false);
    setIsDegreeOpen(false);
    setIsUserOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full bg-white">
      {/* Top utility bar */}
      <div className="hidden bg-[#1F2937] text-white sm:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Globe className="h-4 w-4 shrink-0" />
            <span>English</span>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 text-xs md:text-sm">
            {["For Individuals", "For Businesses", "For Universities", "For Governments"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  className="transition-colors hover:text-gray-300"
                >
                  {item}
                </a>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Main navigation */}
      <div className="sticky top-0 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="flex min-h-16 flex-nowrap items-center gap-2 py-3 sm:gap-3">
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMenus}
              className="flex shrink-0 items-center text-[#0056D2]"
              aria-label="Course home"
            >
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8" />
              <span className="ml-2 text-lg font-bold tracking-tight sm:text-xl">
                Course
              </span>
            </Link>

            {/* Desktop Explore */}
            <div className="relative hidden shrink-0 lg:block">
              <button
                type="button"
                aria-expanded={isExploreOpen}
                onClick={() => {
                  setIsExploreOpen((open) => !open);
                  setIsDegreeOpen(false);
                  setIsUserOpen(false);
                }}
                className="flex items-center gap-1 font-semibold text-[#0056D2] hover:opacity-80"
              >
                Explore
                <ChevronDown className={`h-4 w-4 transition-transform ${isExploreOpen ? "rotate-180" : ""}`} />
              </button>

              {isExploreOpen && (
                <div className="absolute left-0 top-full z-[70] mt-3 grid w-[min(600px,90vw)] grid-cols-1 gap-2 rounded-lg border border-gray-100 bg-white p-4 shadow-xl sm:grid-cols-2 sm:gap-4 sm:p-6">
                  {exploreItems.map((item) => (
                    <Link
                      key={item.title}
                      href="/"
                      onClick={closeMenus}
                      className="rounded-md p-2 hover:bg-blue-50"
                    >
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="mt-1 text-sm text-gray-500">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop search */}
            <form
              className="relative hidden min-w-0 flex-1 lg:block lg:max-w-[400px]"
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
            >
              <input
                ref={searchRef}
                type="search"
                value={searchTerm}
                onChange={(event) => updateSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="What do you want to learn?"
                aria-label="Search courses"
                className="w-full min-w-0 rounded-md border border-gray-300 py-2 pl-10 pr-10 outline-none transition focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
              />
              <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-[#0056D2]"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </form>

            {/* Right-side actions */}
            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-6">
              {/* Mobile search toggle */}
              <button
                type="button"
                aria-label="Open course search"
                onClick={() => {
                  setIsMobileSearchOpen((open) => !open);
                  setIsMobileMenuOpen(false);
                  setTimeout(() => searchRef.current?.focus(), 0);
                }}
                className="rounded-md p-2 text-[#0056D2] hover:bg-blue-50 lg:hidden"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Online Degree */}
              <div className="relative hidden shrink-0 lg:block">
                <button
                  type="button"
                  aria-expanded={isDegreeOpen}
                  onClick={() => {
                    setIsDegreeOpen((open) => !open);
                    setIsExploreOpen(false);
                    setIsUserOpen(false);
                  }}
                  className="flex items-center gap-1 whitespace-nowrap font-semibold text-[#0056D2] hover:opacity-80"
                >
                  <span className="hidden md:inline">Online Degree</span>
                  <span className="md:hidden">Degrees</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDegreeOpen ? "rotate-180" : ""}`} />
                </button>

                {isDegreeOpen && (
                  <div className="absolute right-0 top-full z-[70] mt-3 w-[min(300px,90vw)] rounded-lg border border-gray-100 bg-white p-2 shadow-xl">
                    {degreeItems.map((item) => (
                      <Link
                        key={item.title}
                        href="/"
                        onClick={closeMenus}
                        className="flex items-center justify-between gap-3 rounded-md p-3 hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-800">{item.title}</span>
                        <span className="shrink-0 text-xs text-gray-500">{item.count}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* User controls */}
              {isLoggedIn && user ? (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Open profile menu"
                    aria-expanded={isUserOpen}
                    onClick={() => {
                      setIsUserOpen((open) => !open);
                      setIsExploreOpen(false);
                      setIsDegreeOpen(false);
                    }}
                    className="flex items-center gap-1 rounded-full p-1 hover:bg-gray-100"
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <ChevronDown className={`hidden h-4 w-4 sm:block ${isUserOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isUserOpen && (
                    <div className="absolute right-0 top-full z-[80] mt-3 w-[min(260px,90vw)] overflow-hidden rounded-lg border border-gray-100 bg-white py-2 shadow-xl">
                      <Link href="/profile" onClick={closeMenus} className="block border-b px-4 py-3 hover:bg-gray-50">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="break-words text-sm text-gray-500">{user.email}</div>
                      </Link>
                      <Link href="/profile" onClick={closeMenus} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My Courses / Profile</Link>
                      <Link href="/certificate" onClick={closeMenus} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">My Certificates</Link>
                      <button type="button" onClick={handleLogout} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="hidden items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 lg:flex"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="" className="h-4 w-4" />
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="hidden whitespace-nowrap rounded-md bg-[#0056D2] px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 lg:inline-flex"
                  >
                    Join for Free
                  </button>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                onClick={() => {
                  setIsMobileMenuOpen((open) => !open);
                  setIsMobileSearchOpen(false);
                }}
                className="shrink-0 rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Expandable mobile search */}
          {isMobileSearchOpen && (
            <form
              className="relative mb-3 w-full lg:hidden"
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
            >
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => updateSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="What do you want to learn?"
                aria-label="Search courses"
                className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-10 outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100"
              />
              <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button type="button" onClick={clearSearch} aria-label="Clear search" className="absolute right-3 top-3.5 text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
          )}

          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <nav className="grid gap-1 border-t border-gray-100 py-3 lg:hidden">
              <button
                type="button"
                onClick={() => {
                  setIsExploreOpen((open) => !open);
                  setIsDegreeOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left font-medium text-[#0056D2] hover:bg-blue-50"
              >
                Explore <ChevronDown className={`h-4 w-4 ${isExploreOpen ? "rotate-180" : ""}`} />
              </button>
              {isExploreOpen && (
                <div className="grid gap-1 rounded-md bg-gray-50 p-2">
                  {exploreItems.map((item) => (
                    <Link key={item.title} href="/" onClick={closeMenus} className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsDegreeOpen((open) => !open);
                  setIsExploreOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left font-medium text-[#0056D2] hover:bg-blue-50"
              >
                Online Degree <ChevronDown className={`h-4 w-4 ${isDegreeOpen ? "rotate-180" : ""}`} />
              </button>
              {isDegreeOpen && (
                <div className="grid gap-1 rounded-md bg-gray-50 p-2">
                  {degreeItems.map((item) => (
                    <Link key={item.title} href="/" onClick={closeMenus} className="flex justify-between gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      <span>{item.title}</span>
                      <span className="shrink-0 text-gray-500">{item.count}</span>
                    </Link>
                  ))}
                </div>
              )}

              {!isLoggedIn && (
                <button type="button" onClick={handleSignIn} className="mt-2 rounded-md bg-[#0056D2] px-3 py-3 text-left font-semibold text-white">
                  Sign in / Join for Free
                </button>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;