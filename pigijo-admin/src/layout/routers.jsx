//routers.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import Admin from "../pages/Admin/admin";
import Article from "../pages/Article/article";
import Document from "../pages/Document/document";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../custom-hooks/useAuth";

const Routers = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/admin" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/article"
        element={
          <ProtectedRoute>
            <Article />
          </ProtectedRoute>
        }
      />
      <Route
        path="/document"
        element={
          <ProtectedRoute>
            <Document />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Routers;
