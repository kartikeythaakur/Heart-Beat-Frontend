import "./App.css";
import EnterOTP from "./components/EnterOTP";
import { Toaster } from "react-hot-toast";
import Signup from "./components/SignUp";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EditBasicInfo from "./components/EditBasicInfo";
import UploadPhotos from "./components/UploadPhotos";
import DashBoard from "./components/DashBoard";
import Login from "./components/Login";
import Matches from "./components/Matches";
import Chat from "./components/Chat";
import LandingPage from "./components/LandingPage";
import ProtectPublic from "./ProtectedRoutes/ProtectPublic";
import ProtectPrivate from "./ProtectedRoutes/ProtectPrivate";
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Protect Public Routes  */}
          <Route element={<ProtectPublic />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enter-otp" element={<EnterOTP />} />
          </Route>

          {/* Protect Profile  */}
          <Route element={<ProtectPrivate />}>
            <Route path="/editBasicInfo" element={<EditBasicInfo />} />
            <Route path="/uploadPhotos" element={<UploadPhotos />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
