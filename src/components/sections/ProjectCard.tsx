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

  return (
    <Card className="group overflow-hidden">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-label="OPEN"
        className="block h-full"
      >
        <div
          className={cn(
            "relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br sm:h-60",
            gradient.from,
            gradient.to
          )}
        >
          {project.liveBadge ? (
            <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
              {project.liveBadge}
            </span>
          ) : null}
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

          {project.url ? (
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-accent transition-colors group-hover:text-white">
              Open
              <Icon name="arrow-up-right" size={16} />
            </span>
          ) : null}
        </div>
      </a>
    </Card>
  );
}