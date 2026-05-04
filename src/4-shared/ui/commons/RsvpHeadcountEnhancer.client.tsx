"use client";

import { useEffect, useRef } from "react";

export function RsvpHeadcountEnhancer() {
  const lastNonZero = useRef("1");

  useEffect(() => {
    const form = document.querySelector('form[action="/api/rsvp/submit"]');
    const select = document.getElementById(
      "rsvp-headcount",
    ) as HTMLSelectElement | null;
    const attending = document.querySelector(
      'input[name="status"][value="attending"]',
    ) as HTMLInputElement | null;
    const notAttending = document.querySelector(
      'input[name="status"][value="not_attending"]',
    ) as HTMLInputElement | null;

    if (!form || !select || !attending || !notAttending) {
      return;
    }

    const apply = () => {
      if (notAttending.checked) {
        if (select.value !== "0") {
          lastNonZero.current = select.value;
        }

        select.value = "0";
        select.disabled = true;
        select.setAttribute("aria-disabled", "true");
        select.classList.add("opacity-60", "cursor-not-allowed");
        return;
      }

      select.disabled = false;
      select.removeAttribute("aria-disabled");
      select.classList.remove("opacity-60", "cursor-not-allowed");

      if (select.value === "0") {
        select.value = lastNonZero.current || "1";
      }
    };

    const handleSelectChange = () => {
      if (select.value !== "0") {
        lastNonZero.current = select.value;
      }
    };

    attending.addEventListener("change", apply);
    notAttending.addEventListener("change", apply);
    select.addEventListener("change", handleSelectChange);

    apply();

    return () => {
      attending.removeEventListener("change", apply);
      notAttending.removeEventListener("change", apply);
      select.removeEventListener("change", handleSelectChange);
    };
  }, []);

  return null;
}
