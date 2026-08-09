import Skeleton from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen flex-col p-8">
      <Skeleton className="h-8 w-64" />
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}