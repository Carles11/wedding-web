import { TranslationDictionary } from "./translations";

export type MenuItem = { id: string; key: string; fallback: string };

export type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  lang: string;
  translations?: TranslationDictionary | null;
  // Reuse the TopMenu.handleClick signature (it may close the menu itself).
  onItemClick: (
    e: React.MouseEvent,
    id: string,
    isMobileOverlay?: boolean,
  ) => Promise<void> | void;
};
