// features/auth/components/RegisterForm.tsx

// Register form component
// Handles form state, validation, and submission
// Delegates register logic to useRegister hook

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User, Mail, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterSchema } from "../schema/register.schema";
import { ROUTES } from "@/constants/routes";
import styles from "./AuthForms.module.css";

// ─────────────────────────────────────────────────────
// PASSWORD STRENGTH INDICATOR
// Shows password strength based on criteria
// ─────────────────────────────────────────────────────
const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const STRENGTH_CONFIG = [
  { label: "Weak",      color: "bg-red-500" },
  { label: "Fair",      color: "bg-amber-500" },
  { label: "Good",      color: "bg-yellow-500" },
  { label: "Strong",    color: "bg-emerald-500" },
];

// ─────────────────────────────────────────────────────
// REGISTER FORM COMPONENT
// ─────────────────────────────────────────────────────
const RegisterForm = () => {
  const { register: registerUser, isLoading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      fullName: "",
      gender: undefined,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password for strength indicator
  const passwordValue = watch("password");
  const passwordStrength = getPasswordStrength(passwordValue || "");

  const onSubmit = async (data: RegisterSchema) => {
    await registerUser(data);
  };

  return (
    <div className={cn("space-y-7 bg-white rounded-3xl shadow-2xl shadow-black/20 p-8", styles.card, styles.registerCard)}>

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

        <div className={cn("pt-2", styles.headerCopy)}>
          <h2 className="text-xl font-semibold text-zinc-900">
            Create an account
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Fill in your details to get started
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.registerForm}>

        {/* Full Name + Username — 2 columns */}
        <div className={cn("grid grid-cols-2 gap-3", styles.fieldGrid)}>

          {/* Full Name */}
          <div className={styles.field}>
            <Label
              htmlFor="fullName"
              className="text-[13px] font-medium text-zinc-700"
            >
              Full Name
            </Label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Ahmed Hassan"
                {...register("fullName")}
                className={cn(
                  "pl-10 text-sm bg-white border-zinc-300",
                  styles.control,
                  "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                  "focus-visible:border-blue-500 transition-all",
                  errors.fullName && "border-red-400 focus-visible:ring-red-100"
                )}
              />
            </div>
            {errors.fullName && (
              <p className={cn("text-[12px] text-red-500", styles.error)}>
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div className={styles.field}>
            <Label
              htmlFor="userName"
              className="text-[13px] font-medium text-zinc-700"
            >
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="userName"
                type="text"
                placeholder="ahmed123"
                {...register("userName")}
                className={cn(
                  "pl-10 text-sm bg-white border-zinc-300",
                  styles.control,
                  "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                  "focus-visible:border-blue-500 transition-all",
                  errors.userName && "border-red-400 focus-visible:ring-red-100"
                )}
              />
            </div>
            {errors.userName && (
              <p className={cn("text-[12px] text-red-500", styles.error)}>
                {errors.userName.message}
              </p>
            )}
          </div>

        </div>

        {/* Email + Gender — 2 columns */}
        <div className={cn("grid grid-cols-2 gap-3", styles.fieldGrid)}>

          {/* Email */}
          <div className={styles.field}>
            <Label
              htmlFor="email"
              className="text-[13px] font-medium text-zinc-700"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="ahmed@example.com"
                {...register("email")}
                className={cn(
                  "pl-10 text-sm bg-white border-zinc-300",
                  styles.control,
                  "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                  "focus-visible:border-blue-500 transition-all",
                  errors.email && "border-red-400 focus-visible:ring-red-100"
                )}
              />
            </div>
            {errors.email && (
              <p className={cn("text-[12px] text-red-500", styles.error)}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className={styles.field}>
            <Label
              htmlFor="gender"
              className="text-[13px] font-medium text-zinc-700"
            >
              Gender
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("gender", value as "Male" | "Female", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={cn(
                  "text-sm bg-white border-zinc-300",
                  styles.control,
                  "focus:ring-2 focus:ring-blue-500/20",
                  "focus:border-blue-500 transition-all",
                  errors.gender && "border-red-400 focus:ring-red-100"
                )}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className={cn("text-[12px] text-red-500", styles.error)}>
                {errors.gender.message}
              </p>
            )}
          </div>

        </div>

        {/* Password */}
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
              placeholder="Min 8 characters"
              {...register("password")}
              className={cn(
                "pl-10 pr-10 text-sm bg-white border-zinc-300",
                styles.control,
                "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                "focus-visible:border-blue-500 transition-all",
                errors.password && "border-red-400 focus-visible:ring-red-100"
              )}
            />
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

          {/* Password Strength Indicator */}
          {passwordValue && (
            <div className={cn("space-y-1", styles.strength)}>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      i < passwordStrength
                        ? STRENGTH_CONFIG[passwordStrength - 1]?.color
                        : "bg-zinc-200"
                    )}
                  />
                ))}
              </div>
              {passwordStrength > 0 && (
                <p className="text-[11px] text-zinc-500">
                  {STRENGTH_CONFIG[passwordStrength - 1]?.label} password
                </p>
              )}
            </div>
          )}

          {errors.password && (
            <p className={cn("text-[12px] text-red-500", styles.error)}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className={styles.field}>
          <Label
            htmlFor="confirmPassword"
            className="text-[13px] font-medium text-zinc-700"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat your password"
              {...register("confirmPassword")}
              className={cn(
                "pl-10 pr-10 text-sm bg-white border-zinc-300",
                styles.control,
                "focus-visible:ring-2 focus-visible:ring-blue-500/20",
                "focus-visible:border-blue-500 transition-all",
                errors.confirmPassword && "border-red-400 focus-visible:ring-red-100"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showConfirmPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />
              }
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={cn("text-[12px] text-red-500", styles.error)}>
              {errors.confirmPassword.message}
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
            "transition-colors duration-200 rounded-lg",
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
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>

      </form>

      {/* Footer */}
      <p className={cn("text-center text-sm text-zinc-500", styles.footer)}>
        Already have an account?{" "}
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="text-[#1E3A8A] hover:text-[#1D4ED8] font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>

    </div>
  );
};

export default RegisterForm;
