import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8">
      <DashboardSkeleton />
    </main>
  );
}
