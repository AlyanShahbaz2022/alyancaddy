"use client";

import BackToTop from "@/components/ui/BackToTop";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ToastProvider from "@/components/ui/Toast";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CustomCursor />
      <ScrollProgress />
      {children}
      <BackToTop />
    </ToastProvider>
  );
}
