import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import heroImage from "../assets/bahaaa.png";
import bgImage from "../assets/back.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />

      {/* Decorative bubbles */}
      <span className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20 animate-pulse"></span>
      <span className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-32 -right-32 animate-pulse"></span>

      {/* Hero Section */}
      <section className="pt-32 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 gap-10 backdrop-blur-sm bg-black/30 p-10 rounded-3xl">
        {/* Text content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold animate-fadeIn">
            Front End React JS
          </h1>
          <h2 className="text-2xl text-gray-300 animate-fadeIn delay-200">
            With Bahaa Shaheen
          </h2>
          <p className="text-xl text-gray-200 animate-fadeIn delay-400">
            Learn how to build modern web applications, track tasks, manage
            points, and explore your ranking among peers.
          </p>

          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 animate-fadeIn delay-600"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Circular Image */}
        <div className="md:w-1/2 flex justify-center animate-fadeIn delay-600">
          <img
            src={heroImage}
            alt="Bahaa Shaheen"
            className="w-64 h-64 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Tailwind animation classes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }
          .animate-fadeIn.delay-200 {
            animation-delay: 0.2s;
          }
          .animate-fadeIn.delay-400 {
            animation-delay: 0.4s;
          }
          .animate-fadeIn.delay-600 {
            animation-delay: 0.6s;
          }
        `}
      </style>
    </div>
  );
}
