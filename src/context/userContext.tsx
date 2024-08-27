'use client'

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UserContextProps {
  username: string;
  usernameSlug: string;
  userImage: string;
  isAuthenticated: boolean;
  setUsername: (username: string) => void;
  setUserImage: (userImage: string) => void;
  setUsernameSlug: (usernameSlug: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  username: '',
  usernameSlug: '',
  userImage: '',
  isAuthenticated: false,
  setUsername: () => {},
  setUserImage: () => {},
  setUsernameSlug: () => {},
  logout: () => {},
});

interface UserProviderProps {
  children: ReactNode;
  initialData: {
    isAuthenticated: boolean;
    username: string;
    usernameSlug: string;
    userImage: string;
  };
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, initialData }) => {
  const [username, setUsername] = useState(initialData.username);
  const [usernameSlug, setUsernameSlug] = useState(initialData.usernameSlug);
  const [userImage, setUserImage] = useState(initialData.userImage);
  const [isAuthenticated, setIsAuthenticated] = useState(initialData.isAuthenticated);

  const logout = () => {
    setUsername('');
    setUserImage('');
    setUsernameSlug('');
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ username, usernameSlug, userImage, isAuthenticated, setUsernameSlug, setUsername, setUserImage, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);