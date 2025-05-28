import toast from "react-hot-toast";
import { io } from "socket.io-client";

let socket = null;

const getSocket = () => {
  if (!socket) {
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.error("No token provided for socket");
      return null;
    }

    socket = io("http://localhost:5000", {
      auth: {
        token: `Bearer ${token} `,
      },
    });
  }

  return socket;
};

export default getSocket;
