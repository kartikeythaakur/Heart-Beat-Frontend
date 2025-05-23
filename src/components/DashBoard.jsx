import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaBars,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaVenusMars,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { calculateAge } from "../utils/Helper";

const Dashboard = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  // const queryParams = new URLSearchParams(location.search);
  // const email = queryParams.get("email");
  const apiurl = process.env.REACT_APP_BASE_URL;
  const imageApi = process.env.REACT_APP_IMAGE_URL;
  const token = sessionStorage.getItem("token");
  const [userProfile, setUserProfile] = useState(null);
  const [userProfileImages, setUserProfileImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentSwipeImage, setCurrentSwipeImage] = useState(0);
  const [swipeProfiles, setSwipeProfiles] = useState([]);
  const [currentSwipeUser, setCurrentSwipeUser] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiurl}/user/profile`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res?.data) {
          setUserProfile(res?.data?.user);
          const profilePhotos = res?.data?.user?.profilePhotos || [];
          setUserProfileImages(profilePhotos);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch profile."
        );
      }
    };

    const fetchSwipeProfiles = async () => {
      try {
        const res = await axios.get(`${apiurl}/user/swipe-profiles`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res?.data) {
          setSwipeProfiles(res?.data?.swipeUsers);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch swipe profile."
        );
      }
    };

    fetchProfile();
    fetchSwipeProfiles();
  }, [apiurl, token]);

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? userProfileImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === userProfileImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSwipeImage = () => {
    setCurrentSwipeImage((prev) =>
      prev === 0
        ? swipeProfiles[currentSwipeUser]?.profilePhotos?.length - 1 || 0
        : prev - 1
    );
  };

  const nextSwipeImage = () => {
    setCurrentSwipeImage((prev) =>
      prev === (swipeProfiles[currentSwipeUser]?.profilePhotos?.length - 1 || 0)
        ? 0
        : prev + 1
    );
  };

  const nextUser = async () => {
    // debugger;
    const payload =
      {
        likedBy: userProfile?._id,
        likedTo: swipeProfiles[currentSwipeUser]?._id,
      } || null;
    if (payload == null) {
      toast.error("Payload is null");
    }
    // return console.log("Payload: ",payload);
    try {
      const res = await axios.post(`${apiurl}/like/likeAUser`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response after liking: ", res);
      if (res?.data?.matchMessage) {
        toast.success(res?.data?.matchMessage);
      }
      toast.success(`You liked ${swipeProfiles[currentSwipeUser]?.name}`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    if (currentSwipeUser === swipeProfiles.length - 1) {
      setCurrentSwipeUser(0);
      setCurrentSwipeImage(0);
    } else {
      let newUser = currentSwipeUser + 1;
      setCurrentSwipeUser(newUser);
      setCurrentSwipeImage(0);
    }
  };

  const unlikeUser = () => {
    toast.error(`You disliked ${swipeProfiles[currentSwipeUser]?.name}`);
    if (currentSwipeUser === swipeProfiles.length - 1) {
      setCurrentSwipeUser(0);
      setCurrentSwipeImage(0);
    } else {
      let newUser = currentSwipeUser + 1;
      setCurrentSwipeUser(newUser);
      setCurrentSwipeImage(0);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const closeMenu = () => {
    setShowMobileMenu(false);
  };

  const noAction = () => {
    return toast.success(`Hi ${userProfile?.name}`);
  };

  const handleMobileMenu = () => {
    setShowMobileMenu(true);
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 relative font-sans overflow-x-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-white opacity-10 rounded-full animate-ping"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-10 w-full h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white border-opacity-10">
        {/* Mobile menu button */}
        <button
          onClick={handleMobileMenu}
          className="block lg:hidden text-white z-20"
        >
          {showMobileMenu ? <IoClose size={24} /> : <FaBars size={20} />}
        </button>

        {/* Branding */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-2">
          <FaHeart className="text-white text-2xl sm:text-3xl animate-heartbeat" />
          <h1 className="text-lg sm:text-xl font-bold text-white">Heartbeat</h1>
        </div>

        {/* Empty placeholder for alignment */}
        <div className="w-6" />
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 m-4 space-y-3 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Menu</h2>
            {[
              "Likes",
              "Chat",
              "Edit Profile",
              "Settings",
              "Buy Premium",
              "Delete Account",
              "Logout",
              "Close",
            ].map((item) => (
              <button
                key={item}
                className="w-full text-left p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition"
                onClick={() => {
                  if (item === "Logout") return logout();
                  if (item === "Likes") return navigate("/matches");
                  if (item === "Chat") return navigate("/chat");
                  if (item === "Close") return closeMenu();
                  return noAction();
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        {/* Mobile View - Only Swipe Profiles */}
        <div className="lg:hidden">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Discover</h2>

            {swipeProfiles.length > 0 ? (
              <>
                <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-lg overflow-hidden bg-white bg-opacity-30 mb-4">
                  <div className="w-full h-full relative">
                    <img
                      src={`${imageApi}/${swipeProfiles[currentSwipeUser]?.profilePhotos[currentSwipeImage]}`}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                    <button
                      onClick={prevSwipeImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded-full"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextSwipeImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded-full"
                    >
                      ›
                    </button>
                  </div>

                  <div className="absolute bottom-0 w-full p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-bold text-lg">
                      {swipeProfiles[currentSwipeUser]?.name},{" "}
                      {calculateAge(swipeProfiles[currentSwipeUser]?.dob)}
                    </p>
                    <p className="text-sm opacity-80">
                      ({swipeProfiles[currentSwipeUser]?.pronouns})
                    </p>
                    <div className="flex items-center text-sm mt-1">
                      <FaMapMarkerAlt className="mr-2 text-white" />
                      <p>{swipeProfiles[currentSwipeUser]?.location}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-[320px] space-y-3 mb-6">
                  <div className="flex items-start">
                    <FaInfoCircle className="mr-2 mt-0.5 text-white text-opacity-70 flex-shrink-0" />
                    <p className="text-sm">
                      {swipeProfiles[currentSwipeUser]?.bio ||
                        "No bio available"}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <FaVenusMars className="mr-2 text-white text-opacity-70" />
                    <p className="text-sm">
                      {swipeProfiles[currentSwipeUser]?.gender ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <FaHeart className="mr-2 text-white text-opacity-70" />
                    <p className="text-sm">
                      {swipeProfiles[currentSwipeUser]?.sexuality ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button
                    className="bg-white bg-opacity-20 p-4 rounded-full text-2xl hover:bg-red-400 transition"
                    onClick={unlikeUser}
                  >
                    <IoClose />
                  </button>
                  <button
                    className="bg-white bg-opacity-20 p-4 rounded-full text-2xl hover:text-pink-400 transition"
                    onClick={nextUser}
                  >
                    <FaHeart />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full max-w-[320px] aspect-[3/4] rounded-lg bg-white bg-opacity-10 flex items-center justify-center">
                <p className="text-center p-4">
                  No more profiles to swipe right now
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop View - Grid Layout */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min">
          {/* User Profile Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-center">
              {userProfile?.name}
            </h2>

            <div className="relative w-full max-w-[280px] mx-auto aspect-[3/4] rounded-lg overflow-hidden bg-white bg-opacity-30 mb-4">
              {userProfileImages.length > 0 && (
                <div className="w-full h-full relative">
                  <img
                    src={`${imageApi}/${userProfileImages[currentImage]}`}
                    alt={`Profile ${currentImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded-full"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded-full"
                  >
                    ›
                  </button>
                </div>
              )}

              <div className="absolute bottom-0 w-full p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
                <p className="font-bold text-sm">
                  {userProfile?.name || "N/A"},{" "}
                  {calculateAge(userProfile?.dob) || "N/A"} (
                  {userProfile?.pronouns?.[0] || "N/A"})
                </p>
                <div className="flex items-center text-xs">
                  <FaMapMarkerAlt className="mr-2 text-white" />
                  <p>{userProfile?.location}</p>
                </div>
              </div>
            </div>

            <div className="text-left w-full space-y-2">
              <div className="flex items-start">
                <FaInfoCircle className="mr-2 mt-0.5 text-white text-opacity-70 flex-shrink-0" />
                <p className="text-sm">
                  {userProfile?.bio ||
                    "Passionate about tech and long walks on the beach."}
                </p>
              </div>

              <div className="flex items-center">
                <FaVenusMars className="mr-2 text-white text-opacity-70" />
                <p className="text-sm">
                  {userProfile?.gender || "Not specified"}
                </p>
              </div>

              <div className="flex items-center">
                <FaHeart className="mr-2 text-white text-opacity-70" />
                <p className="text-sm">
                  {userProfile?.sexuality || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Swipe Profile Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Discover</h2>

            {swipeProfiles.length > 0 ? (
              <>
                <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-lg overflow-hidden bg-white bg-opacity-30 mb-4">
                  <div className="w-full h-full relative">
                    <img
                      src={`${imageApi}/${swipeProfiles[currentSwipeUser]?.profilePhotos[currentSwipeImage]}`}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                    <button
                      onClick={prevSwipeImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded-full"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextSwipeImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded-full"
                    >
                      ›
                    </button>
                  </div>

                  <div className="absolute bottom-0 w-full p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-bold text-sm">
                      {swipeProfiles[currentSwipeUser]?.name},{" "}
                      {calculateAge(swipeProfiles[currentSwipeUser]?.dob)}
                    </p>
                    <p className="text-xs opacity-80">
                      ({swipeProfiles[currentSwipeUser]?.pronouns})
                    </p>
                    <div className="flex items-center text-xs mt-1">
                      <FaMapMarkerAlt className="mr-2 text-white" />
                      <p>{swipeProfiles[currentSwipeUser]?.location}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-[280px] space-y-2 mb-4">
                  <div className="flex items-start">
                    <FaInfoCircle className="mr-2 mt-0.5 text-white text-opacity-70 flex-shrink-0" />
                    <p className="text-sm">
                      {swipeProfiles[currentSwipeUser]?.bio ||
                        "No bio available"}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <FaVenusMars className="mr-2 text-white text-opacity-70" />
                    <p className="text-sm">
                      {swipeProfiles[currentSwipeUser]?.gender ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <FaHeart className="mr-2 text-white text-opacity-70" />
                    <p className="text-sm">
                      {swipeProfiles[currentSwipeUser]?.sexuality ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button
                    className="bg-white bg-opacity-20 p-4 rounded-full text-2xl hover:bg-red-400 transition"
                    onClick={unlikeUser}
                  >
                    <IoClose />
                  </button>
                  <button
                    className="bg-white bg-opacity-20 p-4 rounded-full text-2xl hover:text-pink-400 transition"
                    onClick={nextUser}
                  >
                    <FaHeart />
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full max-w-[280px] aspect-[3/4] rounded-lg bg-white bg-opacity-10 flex items-center justify-center">
                <p className="text-center p-4">
                  No more profiles to swipe right now
                </p>
              </div>
            )}
          </div>

          {/* Menu - Only shown on desktop */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 space-y-3 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Menu</h2>
            {[
              "Likes",
              "Chat",
              "Edit Profile",
              "Settings",
              "Buy Premium",
              "Delete Account",
              "Logout",
            ].map((item) => (
              <button
                key={item}
                className="w-full text-left p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition"
                onClick={() => {
                  if (item === "Logout") return logout();
                  if (item === "Likes") return navigate("/matches");
                  if (item === "Chat") return navigate("/chat");
                  if (item === "Close") return closeMenu();
                  return noAction();
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
