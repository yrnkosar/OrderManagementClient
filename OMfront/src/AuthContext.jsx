import React, { createContext, useState, useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [user, setUser] = useState(null); // Ensure setUser is here
  const [auth, setAuth] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // Kullanıcı detayları
  const [role, setRole] = useState(null); // Role ekledik

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token); // Token'ı decode ediyoruz
        const customerId = decoded.CustomerId;
        setAuth({
          token: token,
          customerId: customerId,  // Add customerId here
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        });

        setUser(decoded); // Kullanıcı bilgilerini state'e kaydediyoruz
        setCustomerType(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]); // Kullanıcı rolünü set ediyoruz
        setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]); // Role bilgisi
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

        // authToken state'ini ve tüm auth verilerini güncelliyoruz
        setAuthToken(token);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      // Token yoksa tüm state'leri temizliyoruz
      setUser(null);
      setCustomerType(null);
      setUserDetails(null);
      setRole(null); // Role'ü de null yapıyoruz
    }
  }, [authToken]); // authToken değiştiğinde useEffect çalışacak

  const setAuthTokenAndUser = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setUser(null);
    setCustomerType(null);
    setUserDetails(null);
    setRole(null); // Role'ü de sıfırlıyoruz
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
