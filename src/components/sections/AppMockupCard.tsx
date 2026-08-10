import type { Project } from "@/types/content";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { GRADIENTS } from "@/lib/content";
import { cn } from "@/lib/utils";

type AppMockupCardProps = {
  project: Project;
};

export default function AppMockupCard({ project }: AppMockupCardProps) {
  const gradient = GRADIENTS[project.gradient];

  return (
    <Card className="group overflow-hidden">
      <div
        className={cn(
          "grid h-full gap-8 bg-gradient-to-br p-8 sm:p-10 md:grid-cols-[auto_1fr] md:items-center",
          gradient.from,
          gradient.to
        )}
      >
        <div className="relative mx-auto h-[400px] w-[200px] shrink-0 rounded-[2rem] border-[10px] border-line bg-base shadow-2xl">
          <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-surface">
            {project.image ? (
              // Uploaded app screenshot (Cloudinary).
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="h-2 w-7 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span className="h-2 w-24 rounded bg-white/25" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="rounded-xl bg-card p-3">
                    <div className="h-2 w-3/4 rounded bg-white/25" />
                    <div className="mt-2 h-2 w-1/2 rounded bg-white/15" />
                  </div>
                  <div className="rounded-xl bg-card p-3">
                    <div className="h-2 w-2/3 rounded bg-white/25" />
                    <div className="mt-2 h-2 w-1/3 rounded bg-white/15" />
                  </div>
                  <div className="rounded-xl bg-card p-3">
                    <div className="h-2 w-4/5 rounded bg-white/25" />
                    <div className="mt-2 h-2 w-1/2 rounded bg-white/15" />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="h-9 w-24 rounded-full bg-white/15" />
                    <span className="h-9 w-9 rounded-full bg-accent" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="pt-2">
          <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
            {project.liveBadge}
          </span>
          <span className="ml-2 text-[11px] font-bold uppercase tracking-widest text-white/80">
            {project.category}
          </span>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
            {project.title}
          </h3>

          <dl className="mt-5 space-y-3 text-sm text-white/85">
            <div>
              <dt className="inline font-bold text-white">Problem: </dt>
              <dd className="inline">{project.problem}</dd>
            </div>
            <div>
              <dt className="inline font-bold text-white">Built: </dt>
              <dd className="inline">{project.built}</dd>
            </div>
            <div>
              <dt className="inline font-bold text-white">Result: </dt>
              <dd className="inline">{project.result}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.url && project.url.trim() ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="OPEN"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-80"
            >
              Open
              <Icon name="arrow-up-right" size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}