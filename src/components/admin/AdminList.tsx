"use client";

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

export default function AdminList({
  def,
  value,
  path,
  onChange,
}: AdminListProps) {
  const items = Array.isArray(value) ? value : [];
  const stringList = !def.fields;

  const add = () =>
    onChange(path, [...items, def.factory ? def.factory() : ""]);
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
        {items.map((item, index) => (
          <div key={index} className="rounded-md border border-line p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">
                {def.itemLabel ? `${def.itemLabel} ${index + 1}` : `Item ${index + 1}`}
              </span>
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
            </div>

            {stringList ? (
              <input
                type="text"
                value={String(item ?? "")}
                onChange={(event) =>
                  onChange(`${path}.${index}`, event.target.value)
                }
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent focus:outline-none"
              />
            ) : (
              <div className="space-y-3">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}