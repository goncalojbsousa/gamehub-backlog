'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { checkIsAuthenticated } from '../lib/auth/checkIsAuthenticated';
import { getUserName } from '../lib/auth/getUserNameServerAction';
import { getUserImage } from '../lib/auth/getUserImageServerAction';

interface UserContextProps {
    username: string;
    userImage: string;
    isAuthenticated: boolean;
    setUsername: (username: string) => void;
    setUserImage: (userImage: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextProps>({
    username: '',
    userImage: '',
    isAuthenticated: false,
    setUsername: () => { },
    setUserImage: () => { },
    logout: () => { }
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const logout = () => {
        setUsername('');
        setUserImage('');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const initializeUser = async () => {
            const authStatus = await checkIsAuthenticated();
            setIsAuthenticated(authStatus);

            if (authStatus) {
                const name = await getUserName();
                if (name) {
                    setUsername(name);
                }
                const image = await getUserImage();
                if (image) {
                    setUserImage(image);
                }
            }
        };

        initializeUser();
    }, []);

    return (
        <UserContext.Provider value={{ username, userImage, isAuthenticated, setUsername, setUserImage, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);