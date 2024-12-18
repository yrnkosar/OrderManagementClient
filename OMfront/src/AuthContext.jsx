import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
  };
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);
  
    const setAuthTokenAndUser = (token, userData) => {
      setAuthToken(token);
      setUser(userData);
    };
    const setToken = (token) => {
        setAuthToken(token);
      };
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ authToken, user, setAuthTokenAndUser,setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/*export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };*/
