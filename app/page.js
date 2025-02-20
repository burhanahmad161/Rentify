"use client";
import UserDashboard from "./UserDashboard/layout";
import { AuthProvider } from "../AuthContext";
import AuthPage from "./SignIn/page";
export default function Home() {
  return (
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  );
}