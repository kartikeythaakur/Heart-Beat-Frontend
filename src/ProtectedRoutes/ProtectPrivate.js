import { Navigate, Outlet } from "react-router-dom";

const ProtectPrivate = () => {
  const token = sessionStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectPrivate;
