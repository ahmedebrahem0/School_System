// features/auth/components/LoginForm.tsx

// Login form component
// Handles form state, validation, and submission
// Delegates login logic to useLogin hook

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginSchema } from "../schema/login.schema";
import { ROUTES } from "@/constants/routes";

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

  return (
    <div className="w-full max-w-[420px] space-y-8">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950">EduSystem</h1>
            <p className="text-xs text-zinc-500">Management Portal</p>
          </div>
        </div>

        <div className="pt-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in to your account to continue
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Username or Email Field */}
        <div className="space-y-1.5">
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
                "pl-10 h-11 text-sm bg-white border-zinc-300",
                "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                "focus-visible:border-blue-500 transition-all",
                errors.userNameOrEmail && "border-red-400 focus-visible:ring-red-100"
              )}
            />
          </div>
          {errors.userNameOrEmail && (
            <p className="text-[12px] text-red-500 mt-1">
              {errors.userNameOrEmail.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
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
                "pl-10 pr-10 h-11 text-sm bg-white border-zinc-300",
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
            <p className="text-[12px] text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-11 bg-[#1E3A8A] hover:bg-[#1D4ED8]",
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
            "Sign in"
          )}
        </Button>

      </form>

      {/* Footer */}
      <p className="text-center text-sm text-zinc-500">
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