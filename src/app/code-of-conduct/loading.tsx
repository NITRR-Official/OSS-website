import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";

export default function CodeOfConductLoading() {
  return (
    <Container className="py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Content cards skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>

      {/* Attribution skeleton */}
      <Skeleton className="h-4 w-64 mx-auto mt-8" />
    </Container>
  );
}
