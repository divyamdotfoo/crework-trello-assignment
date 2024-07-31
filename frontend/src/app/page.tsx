/**
 * since the requirements was to build only the frontend with nextjs,
 * this app does not have server side rendering, and lacks the benefits of react server components
 * declaring use client on this page makes everything in this page a client component
 * The frontend will be served statically with express from the build folder.
 */
"use client";

import { DashBoardPage } from "@/components/dashboard";
import { LoginPage } from "@/components/login";
import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const { user, loading } = useAuth();
  if (loading) return <p>loading ....</p>;
  if (!user) return <LoginPage />;
  return <DashBoardPage />;
}
