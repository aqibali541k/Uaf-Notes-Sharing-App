import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import ScreenLoader from "../components/ScreenLoader";

// 1. Create context
const AuthContext = createContext();

// 2. Initial state
const initialState = {
  isAuth: false,
  user: null,
  token: "",
};

// 3. AuthProvider
const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // 4. Fetch profile
  const fetchProfile = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAppLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setState({
        isAuth: true,
        user: res.data.user, // ✅ FIX IS HERE
        token,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      handleLogout();
    } finally {
      setIsAppLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 5. Login
  const handleLogin = (user, token) => {
    localStorage.setItem("authToken", token);
    setState({ isAuth: true, user, token });
  };

  // 6. Register
  const handleRegister = (user, token) => {
    localStorage.setItem("authToken", token);
    setState({ isAuth: true, user, token });
  };

  // 7. Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setState(initialState);
  };

  // 8. Global loader
  if (isAppLoading) return <ScreenLoader />;

  // 9. Provider
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuth: state.isAuth,
        token: state.token,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 10. Custom hook
export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;
