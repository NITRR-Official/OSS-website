import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";

export default function FAQLoading() {
  return (
    <Container className="py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-full max-w-3xl mb-2" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Category cards skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="border-b pb-4 last:border-0">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Contact card skeleton */}
      <Card className="mt-8 p-8">
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-4" />
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Card>
    </Container>
  );
}
