"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils/cn"

const Tabs = TabsPrimitive.Root

// ─── Tabs List ────────────────────────────────────────────────────────────────
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1",
      "bg-zinc-100 rounded-[8px] p-1",
      "h-10",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

// ─── Tabs Trigger ─────────────────────────────────────────────────────────────
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap",
      "rounded-[6px] px-3 py-1.5",
      "text-[13px] font-[500] text-zinc-500",
      "ring-offset-background transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/20",
      "disabled:pointer-events-none disabled:opacity-50",
      // Active
      "data-[state=active]:bg-white data-[state=active]:text-zinc-900",
      "data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
      "data-[state=active]:font-[600]",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// ─── Tabs Content ─────────────────────────────────────────────────────────────
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/20",
      "data-[state=inactive]:hidden",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }