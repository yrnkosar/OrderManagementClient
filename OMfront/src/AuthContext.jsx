import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();


export const AuthProvider = ({ children }) => { 
  
    
   // const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(null); // auth: { token, user }
    const [user, setUser] = useState(() => {
      // Sayfa yenilendiğinde kullanıcıyı localStorage'dan yükle
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }); const [customerType, setCustomerType] = useState(null); // customerType bilgisi
   
    const login = (token, userData) => {
      const userWithToken = { ...userData, token }; // token'ı user objesine ekliyoruz
        setUser(userData); // Kullanıcı verisini context'e kaydediyoruz
        setCustomerType(userData.customerType); // customerType'ı kaydediyoruz    
        setAuth({ token, user: userWithToken }); // auth objesinde token ve user'ı birlikte saklıyoruz
        localStorage.setItem("user", JSON.stringify(userData)); // Kullanıcı bilgisini localStorage'a kaydet
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(userWithToken));
     
      };

  const logout = () => { 
    const navigate = useNavigate();
    setCustomerType(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/"); 
  };
  useEffect(() => {
    
    // Otomatik oturum açma için kullanıcıyı kontrol et
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, customerType,auth, login,  logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);


/*export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };*/
