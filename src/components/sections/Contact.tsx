"use client";

import { useState } from "react";
import { Check, Copy, Eye } from "lucide-react";

import type { Content } from "@/types/content";
import ContactForm from "@/components/sections/ContactForm";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { useToast } from "@/components/ui/Toast";

type ContactProps = {
  contact: Content["contact"];
  socials: Content["socials"];
};

export default function Contact({ contact, socials }: ContactProps) {
  const [copied, setCopied] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(contact.phone.protected === false);
  const toast = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      toast.success("Email copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy email");
    }
  };

  return (
    <Section id="contact" className="bg-surface/30">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading eyebrow={contact.eyebrow} heading={contact.heading} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
            {contact.description}
          </p>

          <ul className="mt-9 space-y-5">
            <li>
              <button
                onClick={copyEmail}
                data-cursor-label="COPY"
                className="group flex items-center gap-4 text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon name="mail" size={18} />
                </span>
                <span className="flex items-center gap-2 text-sm transition-colors group-hover:text-white">
                  {contact.email}
                  {copied ? (
                    <Check size={14} className="text-accent" />
                  ) : (
                    <Copy size={14} className="text-muted" />
                  )}
                </span>
              </button>
            </li>

            <li className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon name="map-pin" size={18} />
              </span>
              <span className="text-sm">{contact.location}</span>
            </li>

            <li>
              {contact.phone.protected && !phoneVisible ? (
                <button
                  onClick={() => setPhoneVisible(true)}
                  data-cursor-label="REVEAL"
                  className="group flex items-center gap-4 text-left"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon name="phone" size={18} />
                  </span>
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted transition-colors group-hover:text-white">
                    <Eye size={14} />
                    {contact.phone.protectedLabel}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon name="phone" size={18} />
                  </span>
                  <span className="text-sm">{contact.phone.number}</span>
                </div>
              )}
            </li>
          </ul>

          <div className="mt-9 flex gap-3">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Icon name={social.icon} size={18} />
              </a>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="card-surface p-6 sm:p-8">
            <ContactForm
              form={contact.form}
              serviceOptions={contact.serviceOptions}
              toastSuccess={contact.toastSuccess}
              toastError={contact.toastError}
              sendingLabel={contact.sendingLabel}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}