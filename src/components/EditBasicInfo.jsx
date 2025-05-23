import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaSpinner } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const EditBasicInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const apiurl = process.env.REACT_APP_BASE_URL;
  const token = sessionStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: email,
    name: "",
    dob: "",
    pronouns: [],
    gender: "",
    sexuality: "",
    location: "",
    genderPreferred: "",
    bio: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.state ||
              "Unknown";

            setFormData((prev) => ({ ...prev, location: city }));
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            toast.error("Unable to fetch city from location.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Location access denied or not supported.");
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser.");
    }
  }, []);

  const pronounOptions = ["He/Him", "She/Her", "They/Them"];
  const genderOptions = ["Male", "Female", "Nonbinary"];
  const sexualityOptions = [
    "Straight",
    "Gay",
    "Lesbian",
    "Bisexual",
    "Asexual",
    "Pansexual",
    "Queer",
    "Other",
  ];
  const genderPreferredOptions = ["Male", "Female", "Non-binary"];

  const handleChange = (e) => {
    const { type, name, value, checked } = e.target;
    
    if (type === "checkbox" && name === "pronouns") {
      setFormData(prev => ({
        ...prev,
        pronouns: checked
          ? [...prev.pronouns, value]
          : prev.pronouns.filter(pronoun => pronoun !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const { name, dob, pronouns, gender, sexuality, bio, location } = formData;
      
      if (!name || !dob || !gender || !sexuality || pronouns.length === 0 || !bio || !location) {
        return toast.error("Please fill all required fields");
      }

      const res = await axios.put(`${apiurl}/user/editProfileInfo`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res?.data) {
        toast.success(res.data.message);
        setTimeout(() => navigate(`/uploadPhotos?email=${email}`), 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-4 py-8 sm:px-6 sm:py-12 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-white opacity-10 rounded-full animate-ping"></div>
      </div>

      {/* Branding */}
      <div className="flex flex-col items-center mb-6 z-10">
        <div className="flex items-center gap-2">
          <FaHeart className="text-white text-4xl sm:text-5xl animate-heartbeat" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Heartbeat</h1>
        </div>
        <h2 className="text-2xl text-white mt-4 font-semibold">
          Edit Basic Info
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-lg z-10 flex flex-col gap-4 text-white"
      >
        {/* Name */}
        <div className="space-y-2">
          <label className="block font-medium">What's your name?</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* DOB */}
        <div className="space-y-2">
          <label className="block font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="block font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Tell us about yourself"
            rows={3}
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="block font-medium">Your Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            readOnly
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none"
          />
        </div>

        {/* Pronouns */}
        <div className="space-y-2">
          <label className="block font-medium">Pronouns</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {pronounOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="pronouns"
                  value={option}
                  checked={formData.pronouns.includes(option)}
                  onChange={handleChange}
                  className="h-4 w-4 accent-pink-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block font-medium">Gender</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {genderOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={handleChange}
                  className="h-4 w-4 accent-pink-500"
                  required
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sexuality */}
        <div className="space-y-2">
          <label className="block font-medium">Sexuality</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sexualityOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sexuality"
                  value={option}
                  checked={formData.sexuality === option}
                  onChange={handleChange}
                  className="h-4 w-4 accent-pink-500"
                  required
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dating Preference */}
        <div className="space-y-2">
          <label className="block font-medium">Dating Preference</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {genderPreferredOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="genderPreferred"
                  value={option}
                  checked={formData.genderPreferred === option}
                  onChange={handleChange}
                  className="h-4 w-4 accent-pink-500"
                  required
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Info"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditBasicInfo;