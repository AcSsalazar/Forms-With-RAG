import React, { createContext, useState, useEffect } from 'react';
import { getUserDetails, getUserProfile } from '../utils/apiServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (access) {
      Promise.all([
        getUserDetails(access),
        getUserProfile(access),
      ]).then(([userData, profileData]) => {
        setUser({ ...userData, token: access });
        setProfile(profileData);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (accessToken) => {
    localStorage.setItem('access', accessToken);
    const [userData, profileData] = await Promise.all([
      getUserDetails(accessToken),
      getUserProfile(accessToken),
    ]);
    setUser({ ...userData, token: accessToken });
    setProfile(profileData);
  };

  const logout = () => {
    localStorage.removeItem('access');
    setUser(null);
    setProfile(null);
  };

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};