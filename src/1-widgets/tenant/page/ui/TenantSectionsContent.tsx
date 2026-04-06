import AccommodationSection from "@/2-features/tenant/sections/ui/AccommodationSection";
import ContactSection from "@/2-features/tenant/sections/ui/ContactSection";
import DetailsSection from "@/2-features/tenant/sections/ui/DetailsSection";
import ProgramSectionComponent from "@/2-features/tenant/sections/ui/ProgramSection";
import WeddingGiftSection from "@/2-features/tenant/sections/ui/WeddingGiftSection";
import WhatElseSection from "@/2-features/tenant/sections/ui/WhatElseSection";

interface TenantSectionsContentProps {
  mainEvent: React.ComponentProps<typeof ProgramSectionComponent>["mainEvent"];
  lang: React.ComponentProps<typeof ProgramSectionComponent>["lang"];
  translations: React.ComponentProps<
    typeof ProgramSectionComponent
  >["translations"];
  normalizedEvents: React.ComponentProps<typeof DetailsSection>["events"];
  accommodations: React.ComponentProps<typeof AccommodationSection>["hotels"];
  whatelse: React.ComponentProps<typeof WhatElseSection>["items"];
  weddingGift: React.ComponentProps<typeof WeddingGiftSection>["data"];
  contact: React.ComponentProps<typeof ContactSection>["data"];
  contactImage: React.ComponentProps<typeof ContactSection>["backgroundImage"];
  shouldRenderDetails: boolean;
  shouldRenderAccommodation: boolean;
  shouldRenderWhatElse: boolean;
  shouldRenderWeddingGift: boolean;
  shouldRenderContact: boolean;
}

export default function TenantSectionsContent({
  mainEvent,
  lang,
  translations,
  normalizedEvents,
  accommodations,
  whatelse,
  weddingGift,
  contact,
  contactImage,
  shouldRenderDetails,
  shouldRenderAccommodation,
  shouldRenderWhatElse,
  shouldRenderWeddingGift,
  shouldRenderContact,
}: TenantSectionsContentProps) {
  return (
    <main className="flex flex-col gap-0">
      <ProgramSectionComponent
        mainEvent={mainEvent}
        lang={lang}
        translations={translations}
      />

      {shouldRenderDetails && (
        <DetailsSection
          events={normalizedEvents}
          lang={lang}
          translations={translations}
        />
      )}

      {shouldRenderAccommodation && (
        <AccommodationSection
          hotels={accommodations}
          translations={translations}
        />
      )}

      {shouldRenderWhatElse && (
        <WhatElseSection
          items={whatelse}
          lang={lang}
          translations={translations}
        />
      )}

      {shouldRenderWeddingGift && (
        <WeddingGiftSection data={weddingGift} translations={translations} />
      )}

      {shouldRenderContact && (
        <ContactSection
          data={contact}
          lang={lang}
          translations={translations}
          backgroundImage={contactImage}
        />
      )}
    </main>
  );
}
