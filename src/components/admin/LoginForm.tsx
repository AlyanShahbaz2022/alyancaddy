"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        toast.success("Welcome back");
        router.push("/admin");
        router.refresh();
      } else {
        setError("Invalid password");
        toast.error("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error ? <p className="text-xs text-accent">{error}</p> : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "CHECKING..." : "LOG IN"}
      </Button>
    </form>
  );
}