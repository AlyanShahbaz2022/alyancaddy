"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import type { Content } from "@/types/content";
import AdminField from "@/components/admin/AdminField";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { setAtPath } from "@/lib/admin/utils";
import { ADMIN_GROUPS } from "@/lib/admin/fields";
import { cn } from "@/lib/utils";

export default function AdminEditor({
  initialContent,
}: {
  initialContent: Content;
}) {
  const [content, setContent] = useState<Content>(initialContent);
  const [active, setActive] = useState<string>("hero");
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const onChange = useCallback((path: string, value: unknown) => {
    setContent((prev) => setAtPath(prev, path, value) as Content);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Changes saved");
      } else {
        toast.error(data.error || "Save failed — check the schema");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  };

  const group = ADMIN_GROUPS.find((g) => g.key === active) ?? ADMIN_GROUPS[0];

  const renderFields = () => {
    if (group.key === "socials") {
      return (
        <AdminField
          def={group.fields[0]}
          value={content.socials}
          path="socials"
          onChange={onChange}
        />
      );
    }
    const section = content[group.key as keyof Omit<Content, "socials">] as Record<string, unknown>;
    return group.fields.map((field) => (
      <AdminField
        key={field.key}
        def={field}
        value={section?.[field.key]}
        path={`${group.key}.${field.key}`}
        onChange={onChange}
      />
    ));
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="z-20 shrink-0 border-b border-line bg-base/90 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <h1 className="truncate font-display text-base uppercase tracking-wide sm:text-lg">
              Content Editor
            </h1>
            <p className="hidden text-xs text-muted sm:block">
              Edits save to the database and update the live site
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="text-sm font-semibold text-muted underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              <span className="hidden sm:inline">View site</span>
              <span className="sm:hidden">View</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-accent"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav className="hidden w-52 shrink-0 overflow-y-auto border-r border-line p-3 lg:block">
          {ADMIN_GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => setActive(g.key)}
              className={cn(
                "mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize transition-colors",
                active === g.key
                  ? "bg-accent text-black"
                  : "text-muted hover:bg-card hover:text-white"
              )}
            >
              {g.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-16 sm:px-5 sm:py-6">
          <div className="mb-5 lg:hidden">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
              Section
            </label>
            <select
              value={active}
              onChange={(event) => setActive(event.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-white"
            >
              {ADMIN_GROUPS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="max-w-2xl space-y-5">
            {renderFields()}
            <div className="pt-2">
              <Button
                onClick={save}
                size="lg"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}