// export default useAuth;
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastVisitedPage, setLastVisitedPage] = useState("/");
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_ADMIN_GET
      );
      const userData = response.data;

      setCurrentUser(userData);
    } catch (error) {
      setCurrentUser(null);
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
        setLastVisitedPage(localStorage.getItem("lastVisitedPage") || "/");
        await fetchUserData();
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleTokenRefresh = async (refreshToken) => {
    try {
      const response = await axios.post(import.meta.env.VITE_REACT_APP_TOKEN, {
        refreshToken: refreshToken,
      });

      if (response.data.accessToken) {
        const newAccessToken = response.data.accessToken;

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        localStorage.setItem("token", newAccessToken);

        console.log("Token refreshed successfully.");
      } else {
        console.error(
          "Invalid access token in refresh response:",
          response.data
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      navigate("/login");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(import.meta.env.VITE_REACT_APP_LOGIN, {
        email,
        password,
      });

      // console.log("Server Response:", response.data);

      const token = response.data.accessToken;
      if (token) {
        // console.log("Received Token:", token);
        localStorage.setItem("token", token);
        localStorage.setItem("lastVisitedPage", lastVisitedPage);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        await fetchUserData();
        // console.log("Login Successful. Redirecting to", lastVisitedPage);
        navigate(lastVisitedPage);
      } else {
        console.error("No access token received from the server");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  const updateLastVisitedPage = (page) => {
    localStorage.setItem("lastVisitedPage", page);
    setLastVisitedPage(page);
  };

  return {
    currentUser,
    loading,
    login,
    logout,
    handleTokenRefresh,
    setLastVisitedPage: updateLastVisitedPage,
  };
};

export default useAuth;
