import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

export default function RequireRole({ roles, children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/app" replace />;

  return children;
}
