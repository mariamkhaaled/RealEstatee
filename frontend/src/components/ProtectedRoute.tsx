import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const normalizedRole = String(user?.role || "").toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).toLowerCase(),
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
