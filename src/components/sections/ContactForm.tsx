"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Content } from "@/types/content";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact";

type ContactFormProps = {
  form: Content["contact"]["form"];
  serviceOptions: string[];
  toastSuccess: string;
  toastError: string;
  sendingLabel: string;
};

export default function ContactForm({
  form,
  serviceOptions,
  toastSuccess,
  toastError,
  sendingLabel,
}: ContactFormProps) {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast.success(toastSuccess);
        reset();
      } else {
        toast.error(toastError);
      }
    } catch {
      toast.error(toastError);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent focus:outline-none";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
          >
            {form.nameLabel}
          </label>
          <input
            id="contact-name"
            {...register("name")}
            placeholder={form.namePlaceholder}
            className={inputClass}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-accent">{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
          >
            {form.emailLabel}
          </label>
          <input
            id="contact-email"
            type="email"
            {...register("email")}
            placeholder={form.emailPlaceholder}
            className={inputClass}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-accent">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-service"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
        >
          {form.serviceLabel}
        </label>
        <select
          id="contact-service"
          {...register("service")}
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>
            {form.servicePlaceholder}
          </option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p className="mt-1 text-xs text-accent">{errors.service.message}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted"
        >
          {form.messageLabel}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          placeholder={form.messagePlaceholder}
          className={`${inputClass} resize-none`}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-accent">{errors.message.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? sendingLabel : form.submitLabel}
      </Button>
    </form>
  );
}