import { Skeleton } from "../ui/skeleton";

export default function FileTreeSkeleton() {
  const SkeletonItem = ({
    width,
    indent = false,
  }: {
    width: string;
    indent?: boolean;
  }) => (
    <div className={`flex items-center space-x-2 ${indent ? "ml-4" : ""}`}>
      <Skeleton className="h-4 w-4" />
      <Skeleton className={`h-4 ${width}`} />
    </div>
  );

  return (
    <div className="space-y-4 py-3 pl-2">
      <div className="space-y-3">
        <SkeletonItem width="w-3/5" />
        <div className="space-y-3">
          <SkeletonItem width="w-4/5" indent />
          <SkeletonItem width="w-2/3" indent />

          <div className="ml-4 space-y-3">
            <SkeletonItem width="w-1/2" />
            <div className="space-y-3">
              <SkeletonItem width="w-3/4" indent />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <SkeletonItem width="w-2/5" />
        <div className="space-y-3">
          <SkeletonItem width="w-1/2" indent />
        </div>
      </div>

      <div className="space-y-2">
        <SkeletonItem width="w-4/6" />
      </div>
    </div>
  );
}
