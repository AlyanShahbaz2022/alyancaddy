"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Download,
  ExternalLink,
  FileBadge,
  FileText,
  GraduationCap,
  X,
} from "lucide-react";

import type { Content, DocumentItem } from "@/types/content";
import { splitHighlighted } from "@/lib/content";

type DocumentsPanelProps = {
  open: boolean;
  onClose: () => void;
  documents: Content["documents"];
};

const actionClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:bg-accent hover:text-black";

function categoryIcon(category: string) {
  const value = category.toLowerCase();
  if (value.includes("cv") || value.includes("resume")) return FileText;
  if (value.includes("certif")) return Award;
  if (value.includes("marks") || value.includes("fsc") || value.includes("matric")) {
    return GraduationCap;
  }
  return FileBadge;
}

function fileExtension(item: DocumentItem): string {
  const source = item.fileName || item.file;
  const match = source.split("?")[0].match(/\.([a-z0-9]{2,5})$/i);
  return match ? match[1].toUpperCase() : "FILE";
}

export default function DocumentsPanel({
  open,
  onClose,
  documents,
}: DocumentsPanelProps) {
  const items = documents.items.filter((item) => item.file.trim());

  // Group by category, keeping the admin-defined order of first appearance.
  const groups = items.reduce<Array<{ category: string; items: DocumentItem[] }>>(
    (acc, item) => {
      const category = item.category.trim() || "Other";
      const group = acc.find((g) => g.category === category);
      if (group) group.items.push(item);
      else acc.push({ category, items: [item] });
      return acc;
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={documents.label}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-base shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-6">
              <div>
                <h2 className="font-display text-2xl uppercase leading-tight tracking-tight">
                  {splitHighlighted(documents.heading).map((segment, index) =>
                    segment.highlighted ? (
                      <span key={index} className="text-accent">
                        {segment.text}
                      </span>
                    ) : (
                      segment.text
                    )
                  )}
                </h2>
                {documents.description ? (
                  <p className="mt-2 text-sm text-muted">{documents.description}</p>
                ) : null}
              </div>
              <button
                onClick={onClose}
                aria-label="Close documents"
                className="shrink-0 rounded-full border border-line p-2 text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
              {groups.length === 0 ? (
                <p className="text-sm text-muted">No documents uploaded yet — check back soon.</p>
              ) : (
                groups.map((group) => {
                  const Icon = categoryIcon(group.category);
                  return (
                    <section key={group.category}>
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                        <Icon size={14} className="text-accent" />
                        {group.category}
                      </h3>
                      <ul className="space-y-3">
                        {group.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-4 rounded-xl border border-line bg-card p-4 transition-colors hover:border-accent/60"
                          >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[10px] font-bold tracking-wider text-accent">
                              {fileExtension(item)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-semibold text-white">
                                {item.title || item.fileName || "Untitled document"}
                              </span>
                              {item.description ? (
                                <span className="mt-0.5 line-clamp-2 block text-xs text-muted">
                                  {item.description}
                                </span>
                              ) : null}
                            </span>
                            <span className="flex shrink-0 items-center gap-2">
                              <a
                                href={item.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View ${item.title || "document"}`}
                                title="View"
                                data-cursor-label="VIEW"
                                className={actionClass}
                              >
                                <ExternalLink size={16} />
                              </a>
                              <a
                                href={`/api/documents/${encodeURIComponent(item.id)}/download`}
                                download
                                aria-label={`Download ${item.title || "document"}`}
                                title="Download"
                                data-cursor-label="SAVE"
                                className={actionClass}
                              >
                                <Download size={16} />
                              </a>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })
              )}
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
