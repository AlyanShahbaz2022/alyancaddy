import Skeleton from "@/components/ui/Skeleton";

export default function SiteSkeleton() {
  return (
    <div className="min-h-screen bg-base text-white">
      <header className="container-x flex h-20 items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="hidden gap-8 md:flex">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </header>

      <main className="container-x grid gap-12 pb-20 pt-10 md:grid-cols-2 md:items-center md:pt-20">
        <div className="space-y-6">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-16 w-11/12" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <Skeleton className="absolute inset-0 rounded-3xl" />
          <Skeleton className="absolute -left-6 top-10 h-20 w-40 rounded-2xl" />
          <Skeleton className="absolute -right-4 bottom-16 h-16 w-36 rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
