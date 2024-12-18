import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    
   // const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(null); // auth: { token, user }
    const [user, setUser] = useState(null); // Kullanıcı bilgileri
    const [customerType, setCustomerType] = useState(null); // customerType bilgisi
   
    const login = (token, userData) => {
        setUser(userData); // Kullanıcı verisini context'e kaydediyoruz
        setCustomerType(userData.customerType); // customerType'ı kaydediyoruz    
        setAuth({ token, user });
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
      };

  const logout = () => {
    setCustomerType(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

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
