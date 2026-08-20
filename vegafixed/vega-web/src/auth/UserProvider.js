import React, { createContext, useState, useEffect } from 'react';


const UserContext = createContext(null);
const UserProvider = ({children}) => {
	// User is the name of the "data" that gets stored in context
  	const [user, setUser] = useState(null);

  	useEffect(() => {
      const name =  window.localStorage.getItem("name");
      const email =  window.localStorage.getItem("email");
      const role =  window.localStorage.getItem("role");
      const jwt =  window.localStorage.getItem("jwt");
      if (email && jwt) {
        setUser({ name, email, role, jwt});
      }
      }, [])

    // Login updates the user data with a name parameter
  	const setUserInfo = (name, email, role, jwt) => {
    	console.log("SetUserInfo called");
      setUser({
        name,
        email,
        role,
        jwt
      });
      window.localStorage.setItem("name", name);
      window.localStorage.setItem("email", email);
      window.localStorage.setItem("role", role);
      window.localStorage.setItem("jwt", jwt);
  	};

  	// Logout updates the user data to default
    const logout = () => {
      setUser(null); // Clear user state completely
      window.localStorage.removeItem("name");
      window.localStorage.removeItem("email");
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("jwt");
    };
	return (
    	<UserContext.Provider value={{ user, setUserInfo, logout }}>
      		{children}
    	</UserContext.Provider>
  	);
}

export {
  UserProvider, 
  UserContext
}