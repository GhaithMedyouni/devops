import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (token && location.pathname === "/auth/login") {
    return <Navigate to="/admin/index" replace />;
  }

  return token ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
