export const CustomLoader = ({ message }: { message: string }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-600 border-t-(--marketing-color-primary) rounded-full animate-spin"></div>

        <div className="absolute w-4 h-4 bg-(--marketing-color-primary) rounded-full animate-pulse"></div>
      </div>

      {/* Animated Text */}
      <p className="mt-6 text-gray-500 font-medium animate-pulse tracking-wide uppercase text-xs">
        {message}
      </p>
    </div>
  );
};
