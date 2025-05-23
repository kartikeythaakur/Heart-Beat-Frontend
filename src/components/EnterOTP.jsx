import axios from "axios";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const EnterOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const isLogin = queryParams.get("isLogin");
  const apiurl = process.env.REACT_APP_BASE_URL;

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    if (otp.includes("")) {
      setError("Please enter all 6 digits.");
    } else {
      setError("");
      console.log("OTP entered:", otp.join(""));
      const newOtp = otp.join("");
      // Here you can add the API call to verify OTP
      debugger;
      try {
        const payload = { email: email, otp: newOtp };
        const res = await axios.post(`${apiurl}/verify-otp`, payload);
        if (res?.data?.success === true) {
          sessionStorage.setItem("token", res?.data?.token);
          toast.success(res?.data?.message || "Success");
          setTimeout(() => {
            if (isLogin) {
              navigate(`/dashboard?email=${email}`);
            } else {
              navigate(`/editBasicInfo?email=${email}`);
            }
          }, 1000);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-white opacity-10 rounded-full animate-ping"></div>
      </div>

      {/* Branding OUTSIDE the card */}
      <div className="flex flex-row items-center gap-2 mb-6 z-10">
        <FaHeart className="text-white text-5xl animate-bounce mb-2" />
        <h1 className="text-4xl font-extrabold text-white">Heartbeat</h1>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg p-8 w-11/12 max-w-md z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Enter OTP
        </h2>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              inputMode="numeric"
              pattern="\d*"
              className="w-12 h-12 md:w-14 md:h-14 text-center rounded-lg bg-white bg-opacity-20 text-white placeholder-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          ))}
        </div>

        {error && <p className="text-red-300 text-center mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default EnterOTP;
