import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "authToken";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      setToken(savedToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (jwt: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, jwt);
    setToken(jwt);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
