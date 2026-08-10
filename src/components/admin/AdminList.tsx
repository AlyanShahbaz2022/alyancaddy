"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { FieldDef } from "@/lib/admin/fields";
import AdminField from "@/components/admin/AdminField";
import { moveItem } from "@/lib/admin/utils";
import { cn } from "@/lib/utils";

type AdminListProps = {
  def: FieldDef;
  value: unknown[];
  path: string;
  onChange: (path: string, value: unknown) => void;
};

// Best-effort human label for a collapsed item header, e.g. a project's title.
function itemTitle(item: unknown): string {
  if (item && typeof item === "object") {
    const obj = item as Record<string, unknown>;
    for (const key of ["title", "question", "name", "label", "value"]) {
      const val = obj[key];
      if (typeof val === "string" && val.trim()) return val.trim();
    }
  }
  return "";
}

export default function AdminList({
  def,
  value,
  path,
  onChange,
}: AdminListProps) {
  const items = Array.isArray(value) ? value : [];
  const stringList = !def.fields;

  // Track which object-items are expanded (collapsed by default).
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const toggle = (index: number) =>
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const add = () => {
    onChange(path, [...items, def.factory ? def.factory() : ""]);
    // Open the newly added item so it's ready to edit.
    setOpenIndexes((prev) => new Set(prev).add(items.length));
  };
  const remove = (index: number) =>
    onChange(path, items.filter((_, idx) => idx !== index));
  const move = (index: number, direction: -1 | 1) =>
    onChange(path, moveItem(items, index, direction));

  const actionClass =
    "flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="rounded-lg border border-line p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">
          {def.label}
        </span>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-black transition-colors hover:bg-accentDark"
        >
          + Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-2 text-xs text-muted">Nothing yet — add an item.</p>
      ) : null}

      <div className="mt-3 space-y-3">
        {items.map((item, index) => {
          const baseLabel = def.itemLabel
            ? `${def.itemLabel} ${index + 1}`
            : `Item ${index + 1}`;
          const title = itemTitle(item);
          const isOpen = stringList || openIndexes.has(index);

          const controls = (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                aria-label="Move up"
                className={actionClass}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                aria-label="Move down"
                className={actionClass}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove"
                className={cn(actionClass, "hover:border-accent hover:text-accent")}
              >
                ×
              </button>
            </div>
          );

          return (
            <div key={index} className="rounded-md border border-line p-3">
              {stringList ? (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted">
                      {baseLabel}
                    </span>
                    {controls}
                  </div>
                  <input
                    type="text"
                    value={String(item ?? "")}
                    onChange={(event) =>
                      onChange(`${path}.${index}`, event.target.value)
                    }
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent focus:outline-none"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <ChevronDown
                        size={16}
                        className={cn(
                          "shrink-0 text-muted transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                      <span className="truncate text-xs font-semibold text-white">
                        {title || baseLabel}
                      </span>
                      {title ? (
                        <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted">
                          {baseLabel}
                        </span>
                      ) : null}
                    </button>
                    {controls}
                  </div>

                  {isOpen ? (
                    <div className="mt-3 space-y-3 border-t border-line pt-3">
                      {(def.fields ?? []).map((field) => (
                        <AdminField
                          key={field.key}
                          def={field}
                          value={
                            item && typeof item === "object"
                              ? (item as Record<string, unknown>)[field.key]
                              : undefined
                          }
                          path={`${path}.${index}.${field.key}`}
                          onChange={onChange}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}