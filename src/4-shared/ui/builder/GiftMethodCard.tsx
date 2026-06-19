import type { ReactNode } from "react";

type GiftMethodCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

export default function GiftMethodCard({
  icon,
  title,
  description,
  children,
}: GiftMethodCardProps) {
  return (
    <div className="bg-white border p-4 rounded-xl shadow-xs mb-5 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center font-semibold text-(--builder-color-primary) gap-2">
        {icon} {title}
      </div>
      <div className="text-xs text-gray-500 mb-4 dark:text-gray-400">{description}</div>
      {children}
    </div>
  );
}
