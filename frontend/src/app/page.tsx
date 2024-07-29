/**
 * since the requirements was to build only the frontend with nextjs,
 * this app does not have server side rendering, and lacks the benefits of react server components
 * declaring use client on this page makes everything in this page a client component
 * The frontend will be served statically with express from the build folder.
 */
"use client";

import { SignUpForm } from "@/components/signup";
import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const { data, loading } = useAuth();
  console.log(data);
  if (loading) return <p>loading ....</p>;
  if (!data.isAuth) return <SignUpForm />;
  return <p>trello board</p>;
}
