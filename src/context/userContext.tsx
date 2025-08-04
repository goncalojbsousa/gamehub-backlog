'use client'

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

interface UserContextProps {
  username: string;
  usernameSlug: string;
  userImage: string;
  userRole?: string;
  isAuthenticated: boolean;
  setUsername: (username: string) => void;
  setUserImage: (userImage: string) => void;
  setUsernameSlug: (usernameSlug: string) => void;
  setUserRole: (userRole: string) => void;
  updateUserData: (data: { username?: string; usernameSlug?: string; userImage?: string; userRole?: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  username: '',
  usernameSlug: '',
  userImage: '',
  userRole: '',
  isAuthenticated: false,
  setUsername: () => {},
  setUserImage: () => {},
  setUsernameSlug: () => {},
  setUserRole: () => {},
  updateUserData: () => {},
  logout: () => {},
});

interface UserProviderProps {
  children: ReactNode;
  initialData: {
    isAuthenticated: boolean;
    username: string;
    usernameSlug: string;
    userImage: string;
    userRole?: string;
  };
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, initialData }) => {
  const [username, setUsername] = useState(initialData.username);
  const [usernameSlug, setUsernameSlug] = useState(initialData.usernameSlug);
  // Garantir que userImage nunca seja uma string vazia
  const [userImage, setUserImage] = useState(initialData.userImage && initialData.userImage.trim() !== '' ? initialData.userImage : '');
  const [userRole, setUserRole] = useState(initialData.userRole || '');
  const [isAuthenticated, setIsAuthenticated] = useState(initialData.isAuthenticated);

  // Verificação adicional: se não há dados válidos, considerar como não autenticado
  useEffect(() => {
    if (isAuthenticated && (!username || !usernameSlug)) {
      console.log('Usuário marcado como autenticado mas sem dados válidos, limpando estado');
      setIsAuthenticated(false);
      setUsername('');
      setUsernameSlug('');
      setUserImage('');
    }
  }, [isAuthenticated, username, usernameSlug]);

  const updateUserData = (data: { username?: string; usernameSlug?: string; userImage?: string; userRole?: string }) => {
    if (data.username) setUsername(data.username);
    if (data.usernameSlug) setUsernameSlug(data.usernameSlug);
    if (data.userImage) setUserImage(data.userImage);
    if (data.userRole) setUserRole(data.userRole);
  };

  const logout = () => {
    console.log('Executando logout no contexto');
    setUsername('');
    setUserImage('');
    setUsernameSlug('');
    setUserRole('');
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ username, usernameSlug, userImage, userRole, isAuthenticated, setUsernameSlug, setUsername, setUserImage, setUserRole, updateUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);