// app/(auth)/register/page.tsx

// Register page — renders the RegisterForm component
// All UI logic is handled in the RegisterForm component
// All business logic is handled in the useRegister hook

import type { Metadata } from "next";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your EduSystem account",
};

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;