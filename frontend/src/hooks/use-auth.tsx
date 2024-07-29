"use client";
import { API, fetcher } from "@/fetcher";
import { useAuthData } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  loading: boolean;
  data: useAuthData;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<useAuthData>({ isAuth: false });

  const signIn = () => {
    setData({ isAuth: true });
  };

  const signOut = () => {
    setData({ isAuth: false });
  };

  useEffect(() => {
    const fetchData = async (retries = 2) => {
      try {
        const res = await fetcher<useAuthData>(API.user.checkSession);
        if (res.status === "failed") {
          throw new Error("Fetch failed");
        }
        setData(res.data);
      } catch (err) {
        if (retries > 0) {
          fetchData(retries - 1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ data, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
