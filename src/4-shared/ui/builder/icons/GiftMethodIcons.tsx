import { SVGProps } from "react";

const PRIMARY = "#4f46e5";
const STROKE = {
  stroke: PRIMARY,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function BankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width={24}
      height={24}
      {...props}
    >
      <path
        d="M3 9L12 4L21 9V20C21 20.5523 20.5523 21 20 21H15V16C15 15.4477 14.5523 15 14 15H10C9.44772 15 9 15.4477 9 16V21H4C3.44772 21 3 20.5523 3 20V9Z"
        {...STROKE}
      />
      <path d="M4 10L12 5.5L20 10" {...STROKE} />
    </svg>
  );
}

export function PaypalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width={24}
      height={24}
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="3" {...STROKE} />
      <path d="M2 9H22" {...STROKE} />
      <path d="M6 14H10" {...STROKE} />
      <circle cx="17" cy="14" r="1.5" {...STROKE} />
    </svg>
  );
}

export function MobileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width={24}
      height={24}
      {...props}
    >
      <rect x="7" y="2" width="10" height="20" rx="2.5" {...STROKE} />
      <path d="M10.5 18H13.5" {...STROKE} />
      <path
        d="M7 5.5H17"
        stroke={PRIMARY}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}

export function GiftlistIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width={24}
      height={24}
      {...props}
    >
      <rect x="3" y="8" width="18" height="13" rx="2" {...STROKE} />
      <path
        d="M8 8V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V8"
        {...STROKE}
      />
      <path d="M7 13H17" {...STROKE} />
      <path d="M7 16.5H13" {...STROKE} />
    </svg>
  );
}

export function HoneymoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width={24}
      height={24}
      {...props}
    >
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        {...STROKE}
      />
      <path d="M3 12C3 12 6 8 12 8C18 8 21 12 21 12" {...STROKE} />
      <path d="M8 17C9.5 15.5 11 15 12 15C13 15 14.5 15.5 16 17" {...STROKE} />
    </svg>
  );
}

export function OtherIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      width={24}
      height={24}
      {...props}
    >
      <circle cx="12" cy="12" r="9" {...STROKE} />
      <circle cx="12" cy="12" r="1.5" fill={PRIMARY} />
      <circle cx="7" cy="12" r="1.5" fill={PRIMARY} />
      <circle cx="17" cy="12" r="1.5" fill={PRIMARY} />
    </svg>
  );
}
