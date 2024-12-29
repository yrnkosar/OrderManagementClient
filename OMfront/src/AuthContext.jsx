import React, { createContext, useState, useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(null); 
  const [auth, setAuth] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [userDetails, setUserDetails] = useState(null); 
  const [role, setRole] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token); 
        const customerId = decoded.CustomerId;
        setAuth({
          token: token,
          customerId: customerId,  
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        });

        setUser(decoded); 
        setCustomerType(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]); 
        setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        if (customerId) {
          fetch(`http://localhost:5132/api/Customer/${customerId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => setUserDetails(data))
            .catch((error) => {
              console.error("Failed to fetch user details:", error);
            });
        }

        
        setAuthToken(token);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      
      setUser(null);
      setCustomerType(null);
      setUserDetails(null);
      setRole(null); 
    }
  }, [authToken]); 

  const setAuthTokenAndUser = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setUser(null);
    setCustomerType(null);
    setUserDetails(null);
    setRole(null); 
    setAuthToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        auth,
        customerType,
        userDetails, 
        role, 
        setAuthTokenAndUser,
        setUserDetails,
        setUser,
        setRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
