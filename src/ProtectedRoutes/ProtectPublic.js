import { Navigate, Outlet } from 'react-router-dom';

const ProtectPublic = () => {
  const token = sessionStorage.getItem('token');
  return !token ? <Outlet/> : <Navigate to='/dashboard'/>;
}

export default ProtectPublic;


// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const PublicRoutes = () => {
//   const token = sessionStorage.getItem("token");
//   return !token ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default PublicRoutes;
