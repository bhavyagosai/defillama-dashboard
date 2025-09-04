import { Skeleton } from "@/components/ui/skeleton";

export function PoolDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 container mx-auto p-4 md:p-6 lg:p-8">
      {/* Back to Dashboard Link Skeleton */}
      <Skeleton className="h-5 w-32" />

      {/* Main Details Card Skeleton */}
      <div className="flex flex-col gap-6 rounded-xl border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        {/* Four Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>

      {/* Historical Chart Skeleton */}
      <div className="flex flex-col gap-4 rounded-xl border p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="aspect-video w-full" />
      </div>
    </div>
  );
}
