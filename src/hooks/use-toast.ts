"use client";

import { toast as sonnerToast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

function toast({ title, description, variant = "default" }: ToastProps) {
  return sonnerToast[variant === "destructive" ? "error" : "success"](title, {
    description,
  });
}

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };
