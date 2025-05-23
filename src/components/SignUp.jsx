import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiurl = process.env.REACT_APP_BASE_URL;

  const validateInputs = () => {
    const newErrors = {};
    // Email validation
    if (!email) {
      toast.error("Email is Required");
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    return newErrors;
  };

  const handleSendOTP = async (e) => {
    debugger;
    e.preventDefault();
    console.log(apiurl);
    setIsLoading(true);
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const res = await axios.post(`${apiurl}/user/signup`, { email });
        if (res?.data?.success === true) {
          toast.success(res?.data?.message);
          setTimeout(() => {
            navigate(`/enter-otp?email=${email}`);
          }, 1000);
        }
      } catch (error) {
        //  return toast.error("Error while sending OTP");
        return toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
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

      {/* Branding */}
      <div className="flex items-center gap-2 mb-6 z-10">
        <FaHeart className="text-white text-4xl animate-bounce" />
        <h1 className="text-4xl font-extrabold text-white">HeartBeat</h1>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg p-8 w-11/12 max-w-md z-10">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          What's your email
        </h2>

        {/* Email input */}
        <div className="mb-4">
          {/* <label className="block text-white text-sm mb-2" htmlFor="email">
            Email
          </label> */}
          <input
            type="email"
            id="email"
            className={`w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 ${
              errors.email ? "focus:ring-red-400" : "focus:ring-pink-400"
            }`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-300 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password input */}
        {/* <div className="mb-6">
          <label className="block text-white text-sm mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2 ${
              errors.password ? "focus:ring-red-400" : "focus:ring-pink-400"
            }`}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-300 text-sm mt-1">{errors.password}</p>
          )}
        </div> */}

        {/* Send OTP Button */}
        <button
          disabled={isLoading}
          onClick={(e) => handleSendOTP(e)}
          className="w-full py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all"
        >
          {isLoading === true ? "Sending OTP" : "Send OTP"}
        </button>

        {/* Login Link */}
        <div className="mt-4 text-center z-10">
          <p className="text-white">
            Already have an account?{" "}
            <span
              className="text-black hover:underline cursor-pointer font-semibold"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
