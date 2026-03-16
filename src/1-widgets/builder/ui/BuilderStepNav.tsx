"use client";

import {
  GrayCircleIcon,
  GreenCheckIcon,
  RedDotIcon,
} from "@/4-shared/ui/commons/icons/completenessIcons";
import { Fragment } from "react";

export type StepStatus = "done" | "pending" | "optional";

export interface BuilderStepNavProps {
  stepKeys: string[];
  stepStatuses: StepStatus[];
  active: number;
  onSelect: (index: number) => void;
  translations: Record<string, string>;
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "done") return <GreenCheckIcon />;
  if (status === "optional") return <GrayCircleIcon />;
  return <RedDotIcon />;
}

/**
 * Renders both the mobile step scroller and the desktop sidebar nav.
 */
export default function BuilderStepNav({
  stepKeys,
  stepStatuses,
  active,
  onSelect,
  translations,
}: BuilderStepNavProps) {
  return (
    <div className="lg:flex">
      {/* MOBILE STEP SCROLLER */}
      <div className="lg:hidden border-b bg-white">
        <div className="flex overflow-x-auto gap-2 p-3">
          {stepKeys.map((k, i) => (
            <button
              key={k}
              onClick={() => onSelect(i)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded whitespace-nowrap border ${
                i === active
                  ? "builder-step-nav-mobile-active"
                  : "builder-step-nav-mobile-idle"
              }`}
            >
              <StatusIcon status={stepStatuses[i]} />
              <span className="text-sm">{translations[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <nav className="hidden lg:block w-64 border-r p-4">
        <h3 className="font-semibold text-gray-700 text-2xl">
          {translations["builder.nav.steps_title"]}
        </h3>
        <ul className="mt-4 flex md:block gap-2 md:gap-0 space-y-0 md:space-y-2 min-w-max md:min-w-0">
          {stepKeys.map((k, i) => (
            <Fragment key={k}>
              {i === 7 && (
                <li className="my-3 px-3" aria-hidden="true">
                  <div className="builder-step-divider h-px" />
                </li>
              )}
              <li>
                <button
                  className={`flex items-center px-3 py-2 rounded whitespace-nowrap md:w-full md:text-left ${
                    i === active
                      ? "builder-step-nav-desktop-active"
                      : "builder-step-nav-desktop-idle"
                  }`}
                  onClick={() => onSelect(i)}
                >
                  <span className="w-6 flex justify-center items-center">
                    <StatusIcon status={stepStatuses[i]} />
                  </span>
                  {translations[k]}
                </button>
              </li>
            </Fragment>
          ))}
        </ul>
      </nav>
    </div>
  );
}
