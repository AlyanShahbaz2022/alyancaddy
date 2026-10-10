import type { Project } from "@/types/content";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import TagPill from "@/components/ui/TagPill";
import { GRADIENTS } from "@/lib/content";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const gradient = GRADIENTS[project.gradient];
  const hasUrl = Boolean(project.url && project.url.trim());
  const Wrapper = hasUrl ? "a" : "div";
  const wrapperProps = hasUrl
    ? {
        href: project.url,
        target: "_blank" as const,
        rel: "noopener noreferrer",
        "data-cursor-label": "OPEN",
      }
    : {};

  return (
    <Card className="group overflow-hidden">
      <Wrapper {...wrapperProps} className="block h-full">
        <div
          className={cn(
            "relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br sm:h-60",
            gradient.from,
            gradient.to
          )}
        >
          {project.image ? (
            // Uploaded screenshot shown inside a desktop/browser mockup frame.
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5">
              <div className="w-full overflow-hidden rounded-lg border border-white/15 bg-ink/80 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 h-3 flex-1 truncate rounded-full bg-white/10 px-2 text-[9px] leading-3 text-white/40">
                    {project.watermark}
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-32 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 sm:h-40"
                />
              </div>
            </div>
          ) : null}

          {project.liveBadge ? (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
              {project.liveBadge}
            </span>
          ) : null}

          {project.image ? null : (
            <>
              <Icon
                name={project.icon}
                size={58}
                className="text-white/90 drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
              />
              <span
                aria-hidden
                className="absolute bottom-1 left-0 right-0 truncate px-5 font-display text-xl text-white/20"
              >
                {project.watermark}
              </span>
            </>
          )}
        </div>

        <div className="p-6 sm:p-7">
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent">
            {project.category}
          </span>
          <h3 className="mt-2 font-display text-xl uppercase tracking-wide">
            {project.title}
          </h3>

          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="font-bold text-white">Problem</dt>
              <dd className="mt-0.5 leading-relaxed text-muted">
                {project.problem}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-white">Built</dt>
              <dd className="mt-0.5 leading-relaxed text-muted">
                {project.built}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-white">Result</dt>
              <dd className="mt-0.5 leading-relaxed text-muted">
                {project.result}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <TagPill key={tech}>{tech}</TagPill>
            ))}
          </div>

          {hasUrl ? (
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-accent transition-colors group-hover:text-white">
              Open
              <Icon name="arrow-up-right" size={16} />
            </span>
          ) : null}
        </div>
      </Wrapper>
    </Card>
  );
}