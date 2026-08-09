import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-8">
        <h1 className="font-display text-2xl uppercase tracking-wide">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter the admin password to edit your content.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}