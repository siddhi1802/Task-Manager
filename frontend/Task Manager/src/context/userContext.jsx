import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Tracks initial app load

  // This function clears all user data
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        // We have a token, so let's try to get the user profile
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data); // Set the user in our context
      } catch (error) {
        // The token was invalid or expired
        console.error("Token invalid, user not authenticated", error);
        clearUser(); // Clear the bad token and user state
      } finally {
        // We're done loading, whether we succeeded or failed
        setLoading(false);
      }
    };

    if (accessToken) {
      // If a token exists, validate it by fetching the user
      fetchUser();
    } else {
      // If no token, we are logged out. Stop loading.
      setLoading(false);
    }
  }, []); // The empty array [] ensures this runs only ONCE when the app loads

  // This function is called by your Login page
  const updateUser = (userData) => {
    // Assuming userData from login includes the user object and the token
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false); // No longer loading after login
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;