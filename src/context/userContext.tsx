'use client'

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UserContextProps {
    username: string;
    userImage: string;
    setUsername: (username: string) => void;
    setUserImage: (userImage: string) => void;
}

const UserContext = createContext<UserContextProps>({
    username: '',
    userImage: '',
    setUsername: () => {},
    setUserImage: () => {}
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');

    return (
        <UserContext.Provider value={{ username, userImage, setUsername, setUserImage }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
