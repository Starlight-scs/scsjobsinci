import { Card, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function JobListingLoading() {
  return (
    <div className="flex flex-col gap-6">
      {[...Array(6)].map((item, index) => (
        <Card className="overflow-hidden" key={index}>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="size-12 rounded-lg" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-[60%] md:w-[40%]" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px] rounded-full" />
                  <Skeleton className="h-4 w-[80px] rounded-full" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}