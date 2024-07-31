"use client";
import { API, fetcher } from "@/fetcher";
import { User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  loading: boolean;
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const signIn = (user: User) => {
    setUser(user);
  };

  const signOut = () => {
    setUser(null);
  };

  useEffect(() => {
    const fetchData = async (retries = 2) => {
      try {
        const res = await fetcher<User>(API.user.checkSession);
        if (res.status === "failed") {
          throw new Error("Fetch failed");
        }
        setUser(res.data);
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
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
