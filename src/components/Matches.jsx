import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaSpinner,
  FaMapMarkerAlt,
  // FaComment,
  FaInfoCircle,
  FaVenusMars,
  FaArrowLeft,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { calculateAge, decode } from "../utils/Helper";
import axios from "axios";
import toast from "react-hot-toast";

const Matches = () => {
  const apiurl = process.env.REACT_APP_BASE_URL;
  const imageApi = process.env.REACT_APP_IMAGE_URL;
  const token = sessionStorage.getItem("token");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const data = decode(token);

    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiurl}/like/likes?_id=${data._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res?.data?.liked);
        if (res?.data?.liked) {
          const profiles = res.data.liked.map((like) => {
            return { ...like, imageIndex: 0 };
          });
          setMatches(profiles);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch likes");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [apiurl, token]);

  console.log("Matches:", matches);

  // const handleChat = (userId) => {
  //   navigate(`/chat/${userId}`);
  // };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const prevImage = (index) => {
    const nextImageIndex =
      matches[index].imageIndex === 0
        ? matches[index].likeBy.profilePhotos.length - 1
        : matches[index].imageIndex - 1;
    const newProfiles = [...matches];
    newProfiles[index].imageIndex = nextImageIndex;
    setMatches(newProfiles);
  };

  const nextImage = (index) => {
    const nextImageIndex =
      matches[index].imageIndex ===
      matches[index].likeBy.profilePhotos.length - 1
        ? 0
        : matches[index].imageIndex + 1;
    const newProfiles = [...matches];
    newProfiles[index].imageIndex = nextImageIndex;
    setMatches(newProfiles);
  };

  const acceptMatch = async (index) => {
    const data = decode(token);
    const payload = { likedBy: data._id, likedTo: matches[index].likeBy._id };
    try {
      const res = await axios.post(`${apiurl}/like/likeAUser`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.data?.matchMessage) {
        const newMatches = matches.filter((_, i) => i !== index);
        setMatches(newMatches);
        toast.success(res?.data?.matchMessage);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  console.log("Accept Matches", matches);

  const rejectMatch = async (index) => {
    debugger;
    const payload = { _id: matches[index]._id };
    try {
      const res = await axios.delete(
        `${apiurl}/like/unmatch?_id=${payload._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.message) {
        const newMatches = matches.filter((_, i) => i !== index);
        setMatches(newMatches);
        toast.success(res?.data?.message);
      }
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 relative font-sans overflow-x-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-white opacity-10 rounded-full animate-ping"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-10 w-full h-16 flex items-center justify-between px-6 border-b border-white border-opacity-10">
        {/* Branding */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-2">
          <FaHeart className="text-white text-3xl animate-heartbeat" />
          <h1 className="text-xl font-bold text-white">Heartbeat</h1>
        </div>

        {/* Empty placeholder for alignment */}
        <div className="w-6" />

        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-white hover:text-pink-200 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Your Likes</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-white text-4xl" />
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 text-center">
            <p className="text-white text-lg">No Likes yet. Keep swiping!</p>
          </div>
        ) : (
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          //   {matches.map((match) => (
          //     <div
          //       key={match._id}
          //       className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg text-white"
          //     >
          //       <h2 className="text-lg font-semibold mb-2 text-center">
          //         {match.name}
          //       </h2>

          //       <div className="relative w-full max-w-[280px] mx-auto aspect-[3/4] rounded-lg overflow-hidden bg-white bg-opacity-30 mb-4">
          //         {match.profilePhotos?.[0] && (
          //           <img
          //             src={`http://localhost:5000/${match.profilePhotos[currentImage]}`}
          //             alt={match.name}
          //             className="w-full h-full object-cover"
          //           />
          //         )}

          //         <div className="absolute bottom-0 w-full p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
          //           <p className="font-bold text-sm">
          //             {match.name}, {calculateAge(match.dob)} (
          //             {match.pronouns?.[0] || "N/A"})
          //           </p>
          //           <div className="flex items-center text-xs">
          //             <FaMapMarkerAlt className="mr-2" />
          //             <p>{match.location}</p>
          //           </div>
          //         </div>
          //       </div>

          //       <div className="text-left w-full space-y-2">
          //         <div className="flex items-start">
          //           <FaInfoCircle className="mr-2 mt-0.5 text-opacity-70 flex-shrink-0" />
          //           <p className="text-sm line-clamp-2">
          //             {match.bio || "No bio available"}
          //           </p>
          //         </div>

          //         <div className="flex items-center">
          //           <FaVenusMars className="mr-2 text-opacity-70" />
          //           <p className="text-sm">{match.gender || "Not specified"}</p>
          //         </div>
          //       </div>

          //       <button
          //         // onClick={() => handleChat(match._id)}
          //         className="w-full py-2 mt-4 rounded-md bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium flex items-center justify-center gap-2"
          //       >
          //         <FaHeart className="text-sm" /> Match
          //       </button>

          //       <button
          //         // onClick={() => handleReject(match._id)} // You'll need to implement handleReject function
          //         className="w-full py-2 mt-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium flex items-center justify-center gap-2"
          //       >
          //         <FaTimes className="text-sm" /> Reject
          //       </button>
          //     </div>
          //   ))}
          // </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match, index) => (
              <div
                key={match.likeBy._id}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg text-white"
              >
                <h2 className="text-lg font-semibold mb-2 text-center">
                  {match.likeBy.name}
                </h2>

                <div className="relative w-full max-w-[280px] mx-auto aspect-[3/4] rounded-lg overflow-hidden bg-white bg-opacity-30 mb-4">
                  {match.likeBy.profilePhotos?.[0] && (
                    <img
                      src={`${imageApi}/${
                        match.likeBy.profilePhotos[match.imageIndex]
                      }`}
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Left navigation icon */}
                  <div
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full cursor-pointer hover:bg-black/60 transition"
                    onClick={() => prevImage(index)}
                  >
                    <FaChevronLeft className="text-sm" />
                  </div>

                  {/* Right navigation icon */}
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full cursor-pointer hover:bg-black/60 transition"
                    onClick={() => nextImage(index)}
                  >
                    <FaChevronRight className="text-sm" />
                  </div>

                  <div className="absolute bottom-0 w-full p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-bold text-sm">
                      {match.likeBy.name}, {calculateAge(match.likeBy.dob)} (
                      {match.likeBy.pronouns?.[0] || "N/A"})
                    </p>
                    <div className="flex items-center text-xs">
                      <FaMapMarkerAlt className="mr-2" />
                      <p>{match.likeBy.location}</p>
                    </div>
                  </div>
                </div>

                <div className="text-left w-full space-y-2">
                  <div className="flex items-start">
                    <FaInfoCircle className="mr-2 mt-0.5 text-opacity-70 flex-shrink-0" />
                    <p className="text-sm line-clamp-2">
                      {match.likeBy.bio || "No bio available"}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <FaVenusMars className="mr-2 text-opacity-70" />
                    <p className="text-sm">
                      {match.likeBy.gender || "Not specified"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => acceptMatch(index)}
                  className="w-full py-2 mt-4 rounded-md bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaHeart className="text-sm" /> Match
                </button>

                <button
                  onClick={() => rejectMatch(index)}
                  className="w-full py-2 mt-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaTimes className="text-sm" /> Unmatch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
