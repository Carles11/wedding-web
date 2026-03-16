import type { ReactNode } from "react";

type GiftMethodCardProps = {
  icon: string;
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
    <div className="bg-white border p-4 rounded-xl shadow-xs mb-5">
      <div className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
        {icon} {title}
      </div>
      <div className="text-xs text-gray-500 mb-4">{description}</div>
      {children}
    </div>
  );
}
