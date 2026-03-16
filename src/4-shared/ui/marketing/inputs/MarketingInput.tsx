import { forwardRef, InputHTMLAttributes } from "react";

type MarketingInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id: string;
};

/**
 * Auth/marketing form input with teal focus ring via .marketing-input class.
 */
export const MarketingInput = forwardRef<HTMLInputElement, MarketingInputProps>(
  function MarketingInput({ label, id, className, ...props }, ref) {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={["marketing-input", className].filter(Boolean).join(" ")}
          {...props}
        />
      </div>
    );
  },
);
