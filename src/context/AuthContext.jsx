import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import ScreenLoader from "../components/ScreenLoader";
import { API_URL } from "../constants";

// 1. Initial state
const initialState = {
  isAuth: false,
  user: null,
  token: "",
};

// 2. Create context with robust defaults
const AuthContext = createContext({
  ...initialState,
  handleLogin: () => {},
  handleRegister: () => {},
  handleLogout: () => {},
});

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
        `${API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setState({
        isAuth: true,
        user: res.data.user,
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

// 10. Custom hook with safety check
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
