import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 relative font-sans overflow-hidden px-4">
      {/* Background animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-96 h-96 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white opacity-10 rounded-full animate-ping"></div>
      </div>

      {/* Branding */}
      <div className="z-10 flex items-center gap-2 mb-8 animate-heartbeat">
        <FaHeart className="text-white text-4xl sm:text-5xl" />
        <h1 className="text-3xl sm:text-4xl font-bold">Heartbeat</h1>
      </div>

      {/* Intro Text */}
      <div className="z-10 text-center max-w-xl mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Where Every Connection Starts with a Heartbeat 💖
        </h2>
        <p className="text-sm sm:text-base text-white text-opacity-90 leading-relaxed">
          Heartbeat isn't just a dating app — it's a space where real emotions
          find real people. Whether you're seeking love, companionship, or just
          someone who gets you, your story begins here. Simple, genuine, and
          from the heart.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="z-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 rounded-full bg-white text-pink-600 font-semibold hover:bg-opacity-90 transition shadow-lg"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-full bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-pink-600 transition shadow-lg"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
