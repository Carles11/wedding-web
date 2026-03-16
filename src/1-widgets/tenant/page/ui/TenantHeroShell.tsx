import { LanguageToggle } from "@/2-features/tenant/language-toggle/ui/LanguageToggle";
import HeroSection from "@/2-features/tenant/sections/ui/HeroSection";
import TopMenu from "@/2-features/tenant/top-menu/ui/TopMenu";

interface TenantHeroShellProps {
  lang: React.ComponentProps<typeof TopMenu>["lang"];
  translations: React.ComponentProps<typeof TopMenu>["translations"];
  visibleSectionIds: React.ComponentProps<typeof TopMenu>["visibleSectionIds"];
  availableLangs: React.ComponentProps<typeof LanguageToggle>["availableLangs"];
  hero: React.ComponentProps<typeof HeroSection>["hero"];
  heroImage: React.ComponentProps<typeof HeroSection>["backgroundImage"];
}

export default function TenantHeroShell({
  lang,
  translations,
  visibleSectionIds,
  availableLangs,
  hero,
  heroImage,
}: TenantHeroShellProps) {
  return (
    <div className="relative">
      <div className="absolute top-3 left-3 z-50 pointer-events-auto">
        <div className="backdrop-blur-sm rounded-md p-1 shadow-sm">
          <TopMenu
            lang={lang}
            translations={translations}
            visibleSectionIds={visibleSectionIds}
          />
        </div>
      </div>

      <header
        aria-label="Page controls"
        className="absolute top-3 right-3 z-50 pointer-events-auto"
      >
        <div className="backdrop-blur-sm rounded-md p-1 shadow-sm">
          <LanguageToggle activeLang={lang} availableLangs={availableLangs} />
        </div>
      </header>

      <HeroSection hero={hero} backgroundImage={heroImage} />
    </div>
  );
}
