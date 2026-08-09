import type { Content } from "@/types/content";
import Icon from "@/components/ui/Icon";

type FooterProps = {
  footer: Content["footer"];
  nav: Content["nav"];
  socials: Content["socials"];
  brandDisplay: string;
};

export default function Footer({
  footer,
  nav,
  socials,
  brandDisplay,
}: FooterProps) {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a
            href="#home"
            className="font-display text-xl tracking-widest text-white"
          >
            {brandDisplay}
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {footer.tagline}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-muted">
            Navigation
          </h3>
          <ul className="space-y-2.5">
            {nav.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-muted">
            Services
          </h3>
          <ul className="space-y-2.5">
            {footer.services.map((service) => (
              <li key={service.label}>
                <a
                  href={service.href}
                  className="text-sm text-white/80 transition-colors hover:text-accent"
                >
                  {service.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-muted">
            Connect
          </h3>
          <ul className="space-y-2.5">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-accent"
                >
                  <Icon name={social.icon} size={16} />
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brandDisplay}. {footer.rights}
          </p>
          <p>{footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
