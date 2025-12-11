import Image from "next/image";
import React from "react";
import fs from "fs";
import path from "path";

type FlowerDividerProps = {
  className?: string;
  /**
   * motive formats supported:
   * - "flower2" -> searches known folders for flower2.png (flowerMotives, contactMotives, loveMotives)
   * - "contact:contact1" -> resolves to /assets/contactMotives/contact1.png
   * - "love:love1" -> resolves to /assets/loveMotives/love1.png
   * - "contactMotives/contact1" -> resolves to /assets/contactMotives/contact1.png
   * - an absolute path "/assets/other/whatever.png" is passed through as-is
   */
  motive?: string;
  size?: number; // width in px (height equals width by default)
  opacity?: number; // 0..1
  alt?: string;
};

const DEFAULT_FOLDER = "flowerMotives";
// folders to probe when a plain name is given
const KNOWN_FOLDERS = ["flowerMotives", "contactMotives", "loveMotives"];
const CATEGORY_MAP: Record<string, string> = {
  flower: "flowerMotives",
  contact: "contactMotives",
  love: "loveMotives",
};

/**
 * FlowerDivider that supports motives stored in multiple /public/assets/ folders.
 * Server-side checks the public/assets folder to pick the first existing image when a plain name is given.
 * Decorative: aria-hidden, low default opacity.
 */
export default function FlowerDivider({
  className = "",
  motive = "flower1",
  size,
  opacity = 0.06,
  alt = "",
}: FlowerDividerProps) {
  // Compute candidate public path to the image (URL path used by browser)
  let src: string | null = null;

  // Helper to ensure filename has extension
  const ensureExt = (name: string) =>
    name.includes(".") ? name : `${name}.png`;

  // 1) absolute path -> use as-is
  if (motive.startsWith("/assets/") || motive.startsWith("/")) {
    src = motive;
  } else if (motive.includes("/")) {
    // "folder/filename" -> /assets/folder/filename.png
    const withExt = ensureExt(motive);
    src = `/assets/${withExt}`;
  } else if (motive.includes(":")) {
    // "category:name" syntax -> mapped folder
    const [cat, name] = motive.split(":", 2);
    const folder = CATEGORY_MAP[cat] ?? `${cat}Motives`;
    const withExt = ensureExt(name);
    src = `/assets/${folder}/${withExt}`;
  } else {
    // Plain name like "love1" — probe known folders on server side and pick the first existing file.
    const filename = ensureExt(motive);
    const publicAssetsDir = path.join(process.cwd(), "public", "assets");

    // Try known folders first
    for (const folder of KNOWN_FOLDERS) {
      try {
        const fullPath = path.join(publicAssetsDir, folder, filename);
        if (fs.existsSync(fullPath)) {
          src = `/assets/${folder}/${filename}`;
          break;
        }
      } catch (e) {
        // ignore, exist check may fail in some runtimes; continue to next
      }
    }

    // If not found in known folders, try default location under DEFAULT_FOLDER
    if (!src) {
      const fallbackFull = path.join(publicAssetsDir, DEFAULT_FOLDER, filename);
      if (fs.existsSync(fallbackFull)) {
        src = `/assets/${DEFAULT_FOLDER}/${filename}`;
      } else {
        // Absolute fallback to default path (may 404). Log to help debugging.
        src = `/assets/${DEFAULT_FOLDER}/${filename}`;
        // eslint-disable-next-line no-console
        console.warn(
          `[FlowerDivider] motive "${motive}" not found in known folders. Falling back to ${src}`
        );
      }
    }
  }

  // width/height handling: if size provided, use next/image with explicit width/height for optimization
  const width = size ?? undefined;
  const height = size ?? undefined;

  // Decorative wrapper - aria-hidden and low opacity
  return (
    <div
      aria-hidden="true"
      role="img"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      {width && height ? (
        <Image
          src={src as string}
          alt={alt ?? ""}
          width={width}
          height={height}
          priority={false}
        />
      ) : (
        // fallback <img> for intrinsic sizing to avoid next/image size warnings
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt ?? ""}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      )}
    </div>
  );
}
