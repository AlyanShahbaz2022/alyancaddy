"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";

import { useToast } from "@/components/ui/Toast";

type Submission = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function SubmissionsPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toast = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      if (res.ok) setSubmissions(data.submissions ?? []);
      else toast.error(data.error || "Failed to load requests");
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        toast.success("Request deleted");
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg uppercase tracking-wide">Requests</h2>
          <p className="text-xs text-muted">
            {loading
              ? "Loading…"
              : `${submissions.length} submission${submissions.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Refresh
        </button>
      </div>

      {!loading && submissions.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface px-4 py-8 text-center text-sm text-muted">
          No requests yet.
        </p>
      ) : null}

      <div className="space-y-3">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-lg border border-line bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{s.name}</p>
                <a
                  href={`mailto:${s.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                >
                  <Mail size={13} />
                  {s.email}
                </a>
              </div>
              <button
                onClick={() => remove(s.id)}
                disabled={deletingId === s.id}
                aria-label="Delete request"
                className="shrink-0 rounded-md border border-line p-1.5 text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-semibold uppercase tracking-wider text-accent">
                {s.service}
              </span>
              <span className="text-muted">
                {new Date(s.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
              {s.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
