"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils/cn"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// ─── Overlay ─────────────────────────────────────────────────────────────────
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// ─── Content ─────────────────────────────────────────────────────────────────
// Modal: white, rounded-12, shadow-lg, max-w-md, p-6
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showClose?: boolean
  }
>(({ className, children, showClose = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Position
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        // Size & spacing
        "w-full max-w-lg p-6",
        // Design tokens
        "bg-white rounded-[12px]",
        "shadow-[0_10px_15px_rgba(0,0,0,0.08),0_4px_6px_rgba(0,0,0,0.04)]",
        "border border-zinc-100",
        // Animation
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "duration-200",
        className
      )}
      {...props}
    >
      {children}
      {showClose && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4",
            "flex h-7 w-7 items-center justify-center rounded-[6px]",
            "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20",
            "disabled:pointer-events-none"
          )}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// ─── Header ──────────────────────────────────────────────────────────────────
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col gap-1.5 mb-5",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

// ─── Footer ──────────────────────────────────────────────────────────────────
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 mt-6 pt-5 border-t border-zinc-100",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

// ─── Title ───────────────────────────────────────────────────────────────────
// 18px / 600 / zinc-950
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[18px] font-[600] text-zinc-950 leading-snug",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// ─── Description ─────────────────────────────────────────────────────────────
// 14px / zinc-500
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-[14px] text-zinc-500 leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}