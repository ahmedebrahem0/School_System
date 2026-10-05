// features/auth/components/LoginForm.tsx

// Login form component
// Handles form state, validation, and submission
// Delegates login logic to useLogin hook

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, Map, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginSchema } from "../schema/login.schema";
import { DemoLoginButtons } from "./DemoLoginButtons";
import { ROUTES } from "@/constants/routes";
import type { LoginFormData } from "../types";
import styles from "./AuthForms.module.css";

const LoginForm = () => {
  const { login, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userNameOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    await login(data);
  };

  const handleDemoSelect = async (credentials: LoginFormData) => {
    await login(credentials);
  };

  return (
    <div className={cn("space-y-8 bg-white rounded-3xl shadow-2xl shadow-black/20 p-8", styles.card, styles.loginCard)}>

      {/* Header */}
      <div className={cn("space-y-2", styles.header)}>
        <div className="flex items-center">
          <Image
            src="/logo-school.png"
            alt="EduSystem"
            width={96}
            height={96}
            className={cn("object-contain", styles.logo)}
            priority
          />
        </div>

        <div className={cn("pt-4", styles.headerCopy)}>
          <h2 className="text-xl font-semibold text-zinc-900">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in to your account to continue
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>

        {/* Username or Email Field */}
        <div className={styles.field}>
          <Label
            htmlFor="userNameOrEmail"
            className="text-[13px] font-medium text-zinc-700"
          >
            Username or Email
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="userNameOrEmail"
              type="text"
              placeholder="Enter your username or email"
              autoComplete="username"
              {...register("userNameOrEmail")}
              className={cn(
                "pl-10 text-sm bg-white border-zinc-300",
                styles.control,
                "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                "focus-visible:border-blue-500 transition-all",
                errors.userNameOrEmail && "border-red-400 focus-visible:ring-red-100"
              )}
            />
          </div>
          {errors.userNameOrEmail && (
            <p className={cn("text-[12px] text-red-500 mt-1", styles.error)}>
              {errors.userNameOrEmail.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className={styles.field}>
          <Label
            htmlFor="password"
            className="text-[13px] font-medium text-zinc-700"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              className={cn(
                "pl-10 pr-10 text-sm bg-white border-zinc-300",
                styles.control,
                "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                "focus-visible:border-blue-500 transition-all",
                errors.password && "border-red-400 focus-visible:ring-red-100"
              )}
            />
            {/* Show/Hide Password Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />
              }
            </button>
          </div>
          {errors.password && (
            <p className={cn("text-[12px] text-red-500 mt-1", styles.error)}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full bg-[#1D4ED8] hover:bg-[#1E3A8A]",
            styles.submit,
            "text-white text-[15px] font-medium",
            "transition-colors duration-200",
            "rounded-lg",
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Sign in
            </span>
          )}
        </Button>

      </form>

      {/* Demo Accounts — quick access for portfolio visitors */}
      <DemoLoginButtons onSelect={handleDemoSelect} disabled={isLoading} />

      {/* Footer */}
      <Link
        href={ROUTES.SYSTEM_MAP}
        className={cn("flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600", styles.mapLink)}
      >
        <Map className="h-4 w-4" aria-hidden="true" />
        Explore how the school works
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <p className={cn("text-center text-sm text-zinc-500", styles.footer)}>
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.AUTH.REGISTER}
          className="text-[#1E3A8A] hover:text-[#1D4ED8] font-medium transition-colors"
        >
          Create one
        </Link>
      </p>

    </div>
  );
};

export default LoginForm;
