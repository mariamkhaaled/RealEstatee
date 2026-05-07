import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  photo?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
    window.dispatchEvent(new Event('user-updated'));
  };

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('user');
      setUserState(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};