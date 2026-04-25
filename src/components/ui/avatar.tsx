"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils/cn"

// ─── Avatar Root ──────────────────────────────────────────────────────────────
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: "sm" | "default" | "lg" | "xl"
    /** Ring color based on role */
    ring?: "admin" | "teacher" | "student" | "none"
  }
>(({ className, size = "default", ring = "none", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full",
      // Size variants
      size === "sm" && "h-8 w-8",
      size === "default" && "h-9 w-9",
      size === "lg" && "h-10 w-10",
      size === "xl" && "h-12 w-12",
      // Role ring
      ring === "admin" && "ring-2 ring-indigo-400 ring-offset-1",
      ring === "teacher" && "ring-2 ring-teal-400 ring-offset-1",
      ring === "student" && "ring-2 ring-blue-400 ring-offset-1",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

// ─── Avatar Image ─────────────────────────────────────────────────────────────
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// ─── Avatar Fallback ──────────────────────────────────────────────────────────
// Colored background with initial letter(s)
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    /** Color scheme for the fallback background */
    color?: "blue" | "teal" | "indigo" | "emerald" | "amber" | "zinc"
  }
>(({ className, color = "blue", ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "text-[13px] font-[600] uppercase",
      // Color variants
      color === "blue" && "bg-[#DBEAFE] text-[#1E3A8A]",
      color === "teal" && "bg-[#CCFBF1] text-[#0F766E]",
      color === "indigo" && "bg-indigo-100 text-indigo-700",
      color === "emerald" && "bg-emerald-100 text-emerald-700",
      color === "amber" && "bg-amber-100 text-amber-700",
      color === "zinc" && "bg-zinc-100 text-zinc-600",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// ─── Avatar with initials helper ─────────────────────────────────────────────
interface AvatarWithInitialsProps {
  name: string
  src?: string
  size?: "sm" | "default" | "lg" | "xl"
  ring?: "admin" | "teacher" | "student" | "none"
  color?: "blue" | "teal" | "indigo" | "emerald" | "amber" | "zinc"
  className?: string
}

function AvatarWithInitials({
  name,
  src,
  size = "default",
  ring = "none",
  color = "blue",
  className,
}: AvatarWithInitialsProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Avatar size={size} ring={ring} className={className}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback color={color}>{initials}</AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarWithInitials }