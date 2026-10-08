import Fotter from "@/Components/Fotter";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { initializeCourseReminders } from "@/lib/courseReminders";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeCourseReminders();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Component {...pageProps} />
      <Fotter/>
    </div>
  );
}
