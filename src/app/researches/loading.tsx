import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";

export default function ResearchesLoading() {
  return (
    <Container className="py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-56 mb-4" />
        <Skeleton className="h-5 w-full max-w-3xl mb-2" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end mb-8">
        <div className="flex-1">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full sm:w-[200px]" />
        <Skeleton className="h-10 w-full sm:w-[160px]" />
      </div>

      {/* Research cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="flex-1">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
