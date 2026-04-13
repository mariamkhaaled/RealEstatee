import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;