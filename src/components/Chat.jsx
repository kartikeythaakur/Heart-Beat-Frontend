import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaBars,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaVenusMars,
  // FaPaperPlane,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaComment,
  // FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
// import { IoClose, IoMdSend } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateAge, decode } from "../utils/Helper";
import { IoClose } from "react-icons/io5";
import socket from "../Socket/socket";
import getSocket from "../Socket/socket";

const ChatDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const apiurl = process.env.REACT_APP_BASE_URL;
  const imageApi = process.env.REACT_APP_IMAGE_URL;
  const token = sessionStorage.getItem("token");
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState(undefined);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentView, setCurrentView] = useState("users"); // 'users', 'chat', 'profile'
  const [currentProfileImage, setCurrentProfileImage] = useState(0);
  const messagesEndRef = useRef(null);
  // const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  const tokenData = decode(token);

  useEffect(() => {
    fetchChatUsers();
    const socket = getSocket();

    if (socket) {
      socketRef.current = socket;

      const handleMessage = (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
        console.log("Received message:", msg);
      };

      socketRef.current.on("receive_message", handleMessage);
    }

    return () => {
      socketRef.current.off("receiveMessage");
      socketRef.current.disconnect(); //CleanUp function
    };
  }, []);

  //Fetch Users
  const fetchChatUsers = async () => {
    try {
      const data = decode(token);
      const res = await axios.get(
        `${apiurl}/like/chatUsers?likedTo=${data._id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data) {
        setChatUsers(res?.data?.chatUsers || []);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch chat users."
      );
    }
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Fetch Messages
  const fetchMessages = async (receiverId) => {
    // debugger;
    if (!receiverId) return toast.error("No receiver Id");
    try {
      const res = await axios.get(
        `${apiurl}/chat/fetchMessages?receiverId=${receiverId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data) {
        setMessages(res?.data?.messages || []);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch messages."
      );
    }
  };

  //Create a new chat room
  const createRoom = async (otheruserId) => {
    if (!token) return toast.error("No token to create a room");
    if (!otheruserId) return toast.error("No user selected");

    try {
      const res = await axios.post(
        `${apiurl}/chat/createChatRoom`,
        { otheruserId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const roomId = res?.data?.data?.roomId;
      if (roomId) {
        setRoomId(roomId);
        toast.success(`Room Id: ${roomId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while joining chat room");
    }
  };

  // console.log("Room ID: ", roomId);

  //Send a message to a particular user
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    if (!roomId) return toast.error("No room id.");
    
    const data = decode(token);

    const payload = {
      senderId: data?._id,
      // receiverId: selectedUser?.likeBy?._id,
      message: newMessage,
      roomId,
    };

    socketRef?.current?.emit("private-message", payload);
    setNewMessage("");
  };

  //Select a user and create a room
  const selectUser = async (user, index) => {
    setSelectedUser(user);
    setCurrentProfileImage(0);
    fetchMessages(user?.likeBy?._id);
    setCurrentView("chat");
    createRoom(user?.likeBy?._id);
  };

  const viewProfile = (user) => {
    setSelectedUser(user);
    setCurrentProfileImage(0);
    setCurrentView("profile");
  };

  const prevProfileImage = () => {
    setCurrentProfileImage((prev) =>
      prev === 0
        ? selectedUser?.likeBy.profilePhotos?.length - 1 || 0
        : prev - 1
    );
  };

  const nextProfileImage = () => {
    setCurrentProfileImage((prev) =>
      prev === (selectedUser?.likeBy.profilePhotos?.length - 1 || 0)
        ? 0
        : prev + 1
    );
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/signup");
    }, 1000);
    return;
  };

  const rejectMatch = async (selectedUser) => {
    const data = decode(token);
    try {
      const res = await axios.delete(
        `${apiurl}/like/unmatchChat?likedBy=${data._id}&likedTo=${selectedUser.likeBy._id}`
      );
      console.log(res);
      if (res?.data) {
        toast.success(res?.data?.message);
        fetchChatUsers();
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error(error);
    }
    console.log(selectedUser);
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
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="block lg:hidden text-white z-20"
        >
          {showMobileMenu ? <IoClose size={24} /> : <FaBars size={20} />}
        </button>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-2">
          <FaHeart className="text-white text-2xl sm:text-3xl animate-heartbeat" />
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Heartbeat Chat
          </h1>
        </div>
        <div className="w-6" />
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 m-4 space-y-3 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Menu</h2>
            {[
              "Matches",
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
                onClick={
                  item === "Logout"
                    ? logout
                    : item === "Matches"
                    ? () => {
                        return navigate("/matches");
                      }
                    : () => {
                        return toast.success(`Hi ${email}`);
                      }
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        {/* Mobile View */}
        <div className="lg:hidden">
          {/* Users List View */}
          {currentView === "users" && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Chat With</h2>
              {chatUsers.length > 0 ? (
                chatUsers.map((user) => (
                  <div
                    key={user?.likeby?._id}
                    className="flex items-center p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition mb-2 cursor-pointer"
                    onClick={() => {
                      selectUser(user);
                    }}
                  >
                    {user?.likeBy?.profilePhotos ? (
                      <img
                        src={`${imageApi}/${user?.likeBy?.profilePhotos[0]}`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <FaUserCircle className="text-4xl text-white text-opacity-70 mr-3" />
                    )}
                    <div>
                      <p className="font-semibold">{user?.likeBy?.name}</p>
                      {/* <p className="text-sm opacity-80">
                        {calculateAge(user.dob)} ({user.pronouns})
                      </p> */}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewProfile(user);
                      }}
                      className="ml-auto text-sm bg-white bg-opacity-20 px-2 py-1 rounded"
                    >
                      Profile
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center p-4">No users available to chat.</p>
              )}
            </div>
          )}

          {/* Chat View */}
          {currentView === "chat" && selectedUser && (
            <div className="flex flex-col h-full bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 shadow-lg">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setCurrentView("users")}
                  className="text-white mr-3"
                >
                  <FaChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold">
                  {selectedUser?.likeBy?.name}
                </h2>
                <button
                  onClick={() => viewProfile(selectedUser)}
                  className="ml-auto text-sm bg-white bg-opacity-20 px-2 py-1 rounded"
                >
                  Profile
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 min-h-0 overflow-y-auto mb-2 space-y-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderId === selectedUser?.likeBy?._id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.senderId === selectedUser?.likeBy?._id
                          ? "bg-pink-500 text-white"
                          : "bg-white bg-opacity-20 text-black"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 rounded-l-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-50 focus:outline-none"
                />
                <button
                  onClick={() => sendMessage()}
                  className="p-2 bg-pink-500 rounded-r-lg hover:bg-pink-600"
                >
                  <IoMdSend />
                </button>
              </div>
            </div>
          )}

          {/* Profile View */}
          {currentView === "profile" && selectedUser && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg">
              <div className="flex items-center mb-4">
                <button
                  onClick={() =>
                    setCurrentView(selectedUser ? "chat" : "users")
                  }
                  className="text-white mr-3"
                >
                  <FaChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold">
                  {selectedUser?.likeBy?.name}
                </h2>
                <button
                  onClick={() => selectUser(selectedUser)}
                  className="ml-auto text-sm bg-white bg-opacity-20 px-2 py-1 rounded"
                >
                  Chat
                </button>
              </div>
              <div className="relative w-full max-w-[320px] mx-auto aspect-[3/4] rounded-lg overflow-hidden bg-white bg-opacity-30 mb-4">
                {selectedUser?.likeBy?.profilePhotos ? (
                  <>
                    <img
                      src={`${imageApi}/${selectedUser?.likeBy?.profilePhotos[currentProfileImage]}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={prevProfileImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextProfileImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white bg-opacity-10">
                    <FaUserCircle className="text-6xl text-white text-opacity-30" />
                  </div>
                )}
                <div className="absolute bottom-0 w-full p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
                  <p className="font-bold text-lg">
                    {selectedUser?.likeBy?.name},{" "}
                    {calculateAge(selectedUser?.likeBy?.dob)}
                  </p>
                  <p className="text-sm opacity-80">
                    ({selectedUser?.likeBy?.pronouns})
                  </p>
                  <div className="flex items-center text-sm mt-1">
                    <FaMapMarkerAlt className="mr-2 text-white" />
                    <p>{selectedUser.likeBy?.location}</p>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-[320px] mx-auto space-y-3">
                <div className="flex items-start">
                  <FaInfoCircle className="mr-2 mt-0.5 text-white text-opacity-70 flex-shrink-0" />
                  <p className="text-sm">
                    {selectedUser?.likeBy?.bio || "No bio available"}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaVenusMars className="mr-2 text-white text-opacity-70" />
                  <p className="text-sm">
                    {selectedUser?.likeBy?.gender || "Not specified"}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaHeart className="mr-2 text-white text-opacity-70" />
                  <p className="text-sm">
                    {selectedUser?.likeBy?.sexuality || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex h-[calc(100vh-120px)] gap-4">
          {/* Users List - First Column */}
          <div className="w-1/4 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Chat With</h2>
            {chatUsers.length > 0 ? (
              chatUsers.map((user, index) => (
                <div
                  key={user._id}
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition ${
                    selectedUser?._id === user._id
                      ? "bg-white bg-opacity-30"
                      : "bg-white bg-opacity-10 hover:bg-opacity-20"
                  }`}
                  onClick={() => {
                    selectUser(user, index);
                  }}
                >
                  {user.likeBy.profilePhotos?.[0] ? (
                    <img
                      src={`${imageApi}/${user.likeBy.profilePhotos[0]}`}
                      alt={user.likeBy.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <FaUserCircle className="text-4xl text-white text-opacity-70 mr-3" />
                  )}
                  <div className="flex-0 min-w-0">
                    <p className="font-semibold truncate">{user.likeBy.name}</p>
                    {/* <p className="text-sm opacity-80 truncate">
                      {calculateAge(user.likeBy.dob)} ({user.likeBy.pronouns})
                    </p> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-center p-4">No users available to chat.</p>
              </div>
            )}
          </div>

          {/* Chat Window - Second Column */}
          <div className="flex-1 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg">
            {selectedUser ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {selectedUser?.likeBy.profilePhotos[0] ? (
                      <img
                        src={`${imageApi}/${selectedUser?.likeBy?.profilePhotos[0]}`}
                        alt={selectedUser.likeBy.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <FaUserCircle className="text-3xl text-white text-opacity-70 mr-3" />
                    )}
                    <div>
                      <h2 className="font-semibold">{selectedUser.name}</h2>
                      <p className="text-xs opacity-80">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => viewProfile(selectedUser)}
                    className="ml-auto text-sm bg-white bg-opacity-20 px-3 py-1 rounded-lg"
                  >
                    View Profile
                  </button>
                </div>
                {/* <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderId === selectedUser?.likeby?._id
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-lg ${
                          msg.senderId === tokenData?._id
                            ? "bg-white bg-opacity-20"
                            : "bg-pink-500"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div> */}

                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderId === tokenData?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-md p-3 rounded-lg ${
                          msg.senderId === tokenData?._id
                            ? "bg-white bg-opacity-20 text-black"
                            : "bg-pink-500 text-white"
                        }`}
                      >
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center mt-auto">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 rounded-l-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-50 focus:outline-none"
                  />
                  <button
                    onClick={() => sendMessage()}
                    className="p-3 bg-pink-500 rounded-r-lg hover:bg-pink-600"
                  >
                    <IoMdSend size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <FaComment className="text-5xl text-white text-opacity-30 mb-4" />
                <h3 className="text-xl font-medium text-white text-opacity-70">
                  Select a user to start chatting
                </h3>
                <p className="text-white text-opacity-50 mt-2">
                  Choose from your existing conversations
                </p>
              </div>
            )}
          </div>

          {/* User Profile - Third Column */}
          <div className="w-1/4 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 flex flex-col shadow-lg overflow-y-auto">
            {selectedUser ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-white bg-opacity-30 mb-4">
                  {selectedUser?.likeBy?.profilePhotos?.[
                    currentProfileImage
                  ] ? (
                    <>
                      <img
                        src={`${imageApi}/${selectedUser?.likeBy?.profilePhotos[currentProfileImage]}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={prevProfileImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextProfileImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white bg-opacity-10">
                      <FaUserCircle className="text-6xl text-white text-opacity-30" />
                    </div>
                  )}
                  <div className="absolute bottom-0 w-full p-4 text-left bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-bold text-sm">
                      {selectedUser?.likeBy?.name},{" "}
                      {calculateAge(selectedUser?.likeBy?.dob)}
                    </p>
                    <p className="text-xs opacity-80">
                      ({selectedUser?.likeBy?.pronouns})
                    </p>
                    <div className="flex items-center text-xs mt-1">
                      <FaMapMarkerAlt className="mr-2 text-white" />
                      <p>{selectedUser?.likeBy?.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaInfoCircle className="mr-2 mt-0.5 text-white text-opacity-70 flex-shrink-0" />
                    <p className="text-sm">
                      {selectedUser.likeBy.bio || "No bio available"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaVenusMars className="mr-2 text-white text-opacity-70" />
                    <p className="text-sm">
                      {selectedUser.likeBy.gender || "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaHeart className="mr-2 text-white text-opacity-70" />
                    <p className="text-sm">
                      {selectedUser.likeBy.sexuality || "Not specified"}
                    </p>
                  </div>

                  <button
                    onClick={() => rejectMatch(selectedUser)}
                    className="w-full py-2 mt-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium flex items-center justify-center gap-2"
                  >
                    Unmatch <FaTimesCircle className="text-sm" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <FaUserCircle className="text-5xl text-white text-opacity-30 mb-4" />
                <h3 className="text-xl font-medium text-white text-opacity-70">
                  No profile selected
                </h3>
                <p className="text-white text-opacity-50 mt-2">
                  Select a chat to view profile
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;
