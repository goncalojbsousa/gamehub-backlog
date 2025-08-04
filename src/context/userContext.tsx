'use client'

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

/**
 * Interface defining the shape of user context data and methods
 * Provides type safety for user authentication state and profile information
 */
interface UserContextProps {
  username: string;           // User's display name
  usernameSlug: string;       // URL-friendly version of username
  userImage: string;          // User's profile image URL
  userRole?: string;          // User's role (USER/ADMIN)
  isAuthenticated: boolean;   // Authentication status flag
  setUsername: (username: string) => void;
  setUserImage: (userImage: string) => void;
  setUsernameSlug: (usernameSlug: string) => void;
  setUserRole: (userRole: string) => void;
  updateUserData: (data: { username?: string; usernameSlug?: string; userImage?: string; userRole?: string }) => void;
  logout: () => void;
}

/**
 * Default context values for user state
 * Used as fallback when context is not properly initialized
 */
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

/**
 * Props interface for the UserProvider component
 * Defines the required props for initializing user context
 */
interface UserProviderProps {
  children: ReactNode;        // Child components to be wrapped
  initialData: {              // Initial user data from server
    isAuthenticated: boolean;
    username: string;
    usernameSlug: string;
    userImage: string;
    userRole?: string;
  };
}

/**
 * UserProvider component - Manages global user state
 * Provides user authentication and profile data to the entire application
 * Handles state synchronization and validation
 * 
 * @param children - React components to be wrapped with user context
 * @param initialData - Initial user data from server-side authentication
 * @returns Context provider with user state management
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children, initialData }) => {
  // Initialize state with server-provided data
  const [username, setUsername] = useState(initialData.username);
  const [usernameSlug, setUsernameSlug] = useState(initialData.usernameSlug);
  
  // Ensure userImage is never an empty string - use empty string if no valid image
  const [userImage, setUserImage] = useState(initialData.userImage && initialData.userImage.trim() !== '' ? initialData.userImage : '');
  const [userRole, setUserRole] = useState(initialData.userRole || '');
  const [isAuthenticated, setIsAuthenticated] = useState(initialData.isAuthenticated);

  /**
   * Additional validation: if marked as authenticated but no valid data exists,
   * clear the authentication state to prevent inconsistencies
   */
  useEffect(() => {
    if (isAuthenticated && (!username || !usernameSlug)) {
      console.log('User marked as authenticated but without valid data, clearing state');
      setIsAuthenticated(false);
      setUsername('');
      setUsernameSlug('');
      setUserImage('');
    }
  }, [isAuthenticated, username, usernameSlug]);

  /**
   * Updates multiple user data fields at once
   * Useful for bulk updates when user profile changes
   * 
   * @param data - Object containing user data fields to update
   */
  const updateUserData = (data: { username?: string; usernameSlug?: string; userImage?: string; userRole?: string }) => {
    if (data.username) setUsername(data.username);
    if (data.usernameSlug) setUsernameSlug(data.usernameSlug);
    if (data.userImage) setUserImage(data.userImage);
    if (data.userRole) setUserRole(data.userRole);
  };

  /**
   * Logs out the user by clearing all authentication state
   * Called when user signs out or session expires
   */
  const logout = () => {
    console.log('Executing logout in context');
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

/**
 * Custom hook to access user context
 * Provides easy access to user state and methods throughout the application
 * 
 * @returns UserContextProps object with current user state and methods
 */
export const useUser = () => useContext(UserContext);