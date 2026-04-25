// app/(auth)/login/page.tsx

// Login page — renders the LoginForm component
// All UI logic is handled in the LoginForm component
// All business logic is handled in the useLogin hook

import type { Metadata } from "next";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your EduSystem account",
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;