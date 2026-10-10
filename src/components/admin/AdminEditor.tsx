"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

import type { Content } from "@/types/content";
import AdminField from "@/components/admin/AdminField";
import SubmissionsPanel from "@/components/admin/SubmissionsPanel";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { setAtPath } from "@/lib/admin/utils";
import { ADMIN_GROUPS } from "@/lib/admin/fields";
import { cn } from "@/lib/utils";

export default function AdminEditor({
  initialContent,
  initialVersion,
}: {
  initialContent: Content;
  initialVersion: string;
}) {
  const [content, setContent] = useState<Content>(initialContent);
  const [version, setVersion] = useState(initialVersion);
  const [active, setActive] = useState<string>("hero");
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        headers: {
          "Content-Type": "application/json",
          ...(version ? { "x-content-version": version } : {}),
        },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.version) setVersion(data.version);
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

  const selectGroup = (key: string) => {
    setActive(key);
    setSidebarOpen(false);
  };

  const navItems = [
    ...ADMIN_GROUPS.map((g) => ({ key: g.key, label: g.label })),
    { key: "__requests", label: "Requests" },
  ];

  const navButtons = navItems.map((g) => (
    <button
      key={g.key}
      onClick={() => selectGroup(g.key)}
      className={cn(
        "mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold capitalize transition-colors",
        active === g.key
          ? "bg-accent text-black"
          : "text-muted hover:bg-card hover:text-white"
      )}
    >
      {g.label}
    </button>
  ));

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
      <header className="z-20 shrink-0 border-b border-line bg-ink/90 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sections menu"
              className="shrink-0 text-muted transition-colors hover:text-white lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base uppercase tracking-wide sm:text-lg">
                Content Editor
              </h1>
              <p className="hidden text-xs text-muted sm:block">
                Edits save to the database and update the live site
              </p>
            </div>
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
        {/* Desktop sidebar */}
        <nav className="hidden w-52 shrink-0 overflow-y-auto border-r border-line p-3 lg:block">
          {navButtons}
        </nav>

        {/* Mobile drawer + backdrop */}
        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            />
            <nav className="absolute inset-y-0 left-0 flex w-64 max-w-[80%] flex-col overflow-y-auto border-r border-line bg-ink p-3 shadow-2xl">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Sections
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                  className="text-muted transition-colors hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              {navButtons}
            </nav>
          </div>
        ) : null}

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-16 sm:px-5 sm:py-6">
          {active === "__requests" ? (
            <div className="max-w-2xl">
              <SubmissionsPanel />
            </div>
          ) : (
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
          )}
        </main>
      </div>
    </div>
  );
}