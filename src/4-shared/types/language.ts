export type LanguageToggleProps = {
  activeLang: string;
  availableLangs: string[]; // e.g. ['es', 'ca']
  basePath?: string; // e.g. "", "/program", etc - defaults to ""
  className?: string;
};
