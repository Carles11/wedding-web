"use client";

import { BuilderStepNavProps, StepStatus } from "@/4-shared/types";
import {
  GrayCircleIcon,
  GreenCheckIcon,
  RedDotIcon,
} from "@/4-shared/ui/commons/icons/completenessIcons";
import { Fragment } from "react";

const DOMAIN_BILLING_STEP_KEY = "builder.nav.step.domain_billing";

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
  currentLang,
}: BuilderStepNavProps) {
  return (
    <div className="lg:flex">
      {/*********************** MOBILE STEP SCROLLER ***********************/}

      <div className="lg:hidden border-b bg-white dark:bg-gray-800">
        <div className="flex overflow-x-auto gap-2 p-3">
          {stepKeys.map((k, i) => (
            <Fragment key={k}>
              {(() => {
                const isDomainBillingStep = k === DOMAIN_BILLING_STEP_KEY;
                const shouldRenderMobileDivider =
                  stepKeys[i + 1] === DOMAIN_BILLING_STEP_KEY;

                return (
                  <>
                    <div className="flex items-center">
                      <button
                        onClick={() => onSelect(i)}
                        className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded whitespace-nowrap border ${
                          i === active
                            ? "builder-step-nav-mobile-active"
                            : "builder-step-nav-mobile-idle"
                        }`}
                      >
                        {!isDomainBillingStep && (
                          <StatusIcon status={stepStatuses[i]} />
                        )}{" "}
                        <span className="text-sm">{translations[k]}</span>
                      </button>
                    </div>
                    {shouldRenderMobileDivider && (
                      <span
                        aria-hidden="true"
                        className="mx-2 h-9 border-l border-gray-300 dark:border-gray-600 opacity-60"
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </>
                );
              })()}
            </Fragment>
          ))}

          {/* Account tab for mobile */}
          <a
            href={`/${currentLang}/builder/account`}
            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded whitespace-nowrap border builder-step-nav-mobile-idle hover:builder-step-nav-mobile-active transition"
            style={{ textDecoration: "none" }}
          >
            <span className="text-sm">
              {translations["builder.nav.account"] || "Account"}
            </span>
          </a>
        </div>
      </div>

      {/*********************** DESKTOP SIDEBAR ***********************/}

      <nav className="hidden lg:block w-64 border-r p-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-2xl">
          {translations["builder.nav.steps_title"] || "Setup Steps"}
        </h3>
        <ul className="mt-4 flex md:block gap-2 md:gap-0 space-y-0 md:space-y-2 min-w-max md:min-w-0">
          {stepKeys.map((k, i) => (
            <Fragment key={k}>
              {k === DOMAIN_BILLING_STEP_KEY && (
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
                  } cursor-pointer`}
                  onClick={() => onSelect(i)}
                >
                  {k !== DOMAIN_BILLING_STEP_KEY && (
                    <span className="w-6 flex justify-center items-center">
                      <StatusIcon status={stepStatuses[i]} />
                    </span>
                  )}
                  {translations[k] || "Guests & RSVP"}
                </button>
              </li>
            </Fragment>
          ))}
          {/* Account link, visually separated */}

          <li>
            <a
              href={`/${currentLang}/builder/account`}
              className="flex items-center px-3 py-2 rounded whitespace-nowrap md:w-full md:text-left builder-step-nav-desktop-idle hover:builder-step-nav-desktop-active transition"
            >
              {translations["builder.nav.account"] || "Account"}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
