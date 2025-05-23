import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaSpinner, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const UploadPhotos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const apiurl = process.env.REACT_APP_BASE_URL;
  const token = sessionStorage.getItem("token");

  const [photos, setPhotos] = useState([null, null, null, null]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate image type and size
    if (!file.type.match('image.*')) {
      return toast.error("Please upload an image file");
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return toast.error("Image size should be less than 5MB");
    }

    const updatedPhotos = [...photos];
    updatedPhotos[index] = file;
    setPhotos(updatedPhotos);
  };

  const handleRemoveImage = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index] = null;
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all photos are uploaded
    if (photos.some(photo => photo === null)) {
      return toast.error("Please upload all 4 photos");
    }

    const formData = new FormData();
    formData.append('email', email);
    photos.forEach(photo => formData.append("profilePhotos", photo));

    try {
      setIsLoading(true);
      const res = await axios.put(`${apiurl}/user/uploadPhotos`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res?.data) {
        toast.success("Profile completed successfully!");
        setTimeout(() => navigate(`/dashboard?email=${email}`), 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload photos");
    } finally {
      setIsLoading(false);
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
          Upload Profile Photos
        </h2>
      </div>

      {/* Upload Photos Form */}
      <div className="relative bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-lg z-10">
        <div className="mb-6 text-center">
          <p className="text-white/90">
            Upload at least 4 photos to complete your profile
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] rounded-lg border-2 border-dashed border-white/30 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center overflow-hidden"
            >
              {photo ? (
                <>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Profile ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:text-red-300 transition-colors"
                    aria-label="Remove photo"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex items-center justify-center cursor-pointer">
                  <div className="text-center p-4">
                    <div className="text-3xl mb-1">+</div>
                    <div className="text-sm">Add Photo</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || photos.some(photo => photo === null)}
          className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isLoading || photos.some(photo => photo === null)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Uploading...
            </>
          ) : (
            "Complete Profile"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadPhotos;