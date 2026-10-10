"use client";

import { useState } from "react";

import type { FieldDef } from "@/lib/admin/fields";
import AdminList from "@/components/admin/AdminList";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type AdminFieldProps = {
  def: FieldDef;
  value: unknown;
  path: string;
  onChange: (path: string, value: unknown) => void;
};

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent focus:outline-none";

export default function AdminField({ def, value, path, onChange }: AdminFieldProps) {
  if (def.type === "list") {
    return (
      <AdminList
        def={def}
        value={Array.isArray(value) ? value : []}
        path={path}
        onChange={onChange}
      />
    );
  }

  if (def.type === "object") {
    return (
      <fieldset className="rounded-lg border border-line p-3">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-muted">
          {def.label}
        </legend>
        <div className="space-y-3">
          {(def.fields ?? []).map((field) => (
            <AdminField
              key={field.key}
              def={field}
              value={
                value && typeof value === "object"
                  ? (value as Record<string, unknown>)[field.key]
                  : undefined
              }
              path={`${path}.${field.key}`}
              onChange={onChange}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  if (def.type === "image") {
    return <ImageField def={def} value={value} path={path} onChange={onChange} />;
  }

  if (def.type === "file") {
    return <FileField def={def} value={value} path={path} onChange={onChange} />;
  }

  const label = (
    <label htmlFor={path} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
      {def.label}
    </label>
  );

  switch (def.type) {
    case "textarea":
      return (
        <div>
          {label}
          <textarea
            id={path}
            rows={4}
            value={String(value ?? "")}
            onChange={(event) => onChange(path, event.target.value)}
            className={cn(inputClass, "resize-y")}
          />
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input
            id={path}
            type="number"
            value={Number(value ?? 0)}
            onChange={(event) => onChange(path, Number(event.target.value))}
            className={inputClass}
          />
        </div>
      );
    case "boolean":
      return (
        <label
          className="flex cursor-pointer items-center justify-between rounded-lg border border-line bg-surface px-3 py-2"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            {def.label}
          </span>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(path, event.target.checked)}
            className="h-4 w-4 accent-[#E63946]"
          />
        </label>
      );
    case "select":
      return (
        <div>
          {label}
          <select
            id={path}
            value={String(value ?? "")}
            onChange={(event) => onChange(path, event.target.value)}
            className={inputClass}
          >
            {(def.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    default:
      return (
        <div>
          {label}
          <input
            id={path}
            type="text"
            value={String(value ?? "")}
            placeholder={def.placeholder}
            onChange={(event) => onChange(path, event.target.value)}
            className={inputClass}
          />
        </div>
      );
  }
}

function ImageField({
  def,
  value,
  path,
  onChange,
}: AdminFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const toast = useToast();

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    if (def.folder) formData.append("folder", def.folder);
    setUploading(true);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(path, data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await upload(file);
    event.target.value = "";
  };

  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (uploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) await upload(file);
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
        {def.label}
      </span>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          if (!dragging) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          dragging
            ? "border-accent bg-accent/10 text-accent"
            : "border-line bg-surface text-muted hover:border-accent hover:text-accent"
        )}
      >
        {uploading ? (
          <span className="text-xs font-bold uppercase tracking-wider">
            Uploading…
          </span>
        ) : (
          <>
            <span className="text-xs font-bold uppercase tracking-wider">
              Drag &amp; drop an image
            </span>
            <span className="text-[11px] normal-case tracking-normal">
              or click to browse
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="hidden"
          disabled={uploading}
        />
      </label>

      <input
        type="text"
        value={String(value ?? "")}
        placeholder="…or paste an image URL"
        onChange={(event) => onChange(path, event.target.value)}
        className={cn(inputClass, "mt-2")}
      />

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={String(value)}
          alt="Preview"
          className="mt-2 h-20 w-32 rounded-lg border border-line object-cover"
        />
      ) : null}
    </div>
  );
}
const DOCUMENT_ACCEPT =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*";

function FileField({ def, value, path, onChange }: AdminFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const toast = useToast();

  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", def.folder ?? "documents");
    setUploading(true);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(path, data.url);
      if (def.nameKey) {
        const siblingPath = path.split(".").slice(0, -1).concat(def.nameKey).join(".");
        onChange(siblingPath, data.name || file.name);
      }
      toast.success("File uploaded — remember to save");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await upload(file);
    event.target.value = "";
  };

  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (uploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) await upload(file);
  };

  const url = String(value ?? "");

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
        {def.label}
      </span>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          if (!dragging) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          dragging
            ? "border-accent bg-accent/10 text-accent"
            : "border-line bg-surface text-muted hover:border-accent hover:text-accent"
        )}
      >
        {uploading ? (
          <span className="text-xs font-bold uppercase tracking-wider">
            Uploading…
          </span>
        ) : (
          <>
            <span className="text-xs font-bold uppercase tracking-wider">
              Drag &amp; drop a document
            </span>
            <span className="text-[11px] normal-case tracking-normal">
              PDF, Word, PowerPoint, Excel or image — or click to browse
            </span>
          </>
        )}
        <input
          type="file"
          accept={DOCUMENT_ACCEPT}
          onChange={onFile}
          className="hidden"
          disabled={uploading}
        />
      </label>

      <input
        type="text"
        value={url}
        placeholder="…or paste a file URL"
        onChange={(event) => onChange(path, event.target.value)}
        className={cn(inputClass, "mt-2")}
      />

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-accent underline-offset-4 hover:underline"
        >
          Open current file ↗
        </a>
      ) : null}
    </div>
  );
}
