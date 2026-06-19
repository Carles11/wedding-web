export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      {/* Title skeleton */}
      <div className="h-6 w-1/2 bg-gray-200 rounded dark:bg-gray-700" />
      {/* Subtitle skeleton */}
      <div className="h-4 w-2/3 bg-gray-200 rounded dark:bg-gray-700" />
      {/* Input skeletons */}
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-200 rounded dark:bg-gray-700" />
        <div className="h-10 w-full bg-gray-200 rounded dark:bg-gray-700" />
        <div className="h-10 w-3/4 bg-gray-200 rounded dark:bg-gray-700" />
      </div>
      {/* Button skeletons */}
      <div className="flex gap-4 mt-6">
        <div className="h-10 w-24 bg-gray-200 rounded dark:bg-gray-700" />
        <div className="h-10 w-24 bg-gray-200 rounded dark:bg-gray-700" />
      </div>
    </div>
  );
}
