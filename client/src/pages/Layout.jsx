import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useSelector } from "react-redux";
import Loader from "../Components/Loader";
import Login from "./Login";

export default function Layout() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  if (!user) return <Login />;
  if (user.role === "super_admin") return <Navigate to="/super-admin" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "faculty") return <Navigate to="/faculty" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  );
}
