export function WeddWebBadge() {
  return (
    <div className="absolute bottom-4 md:bottom-8 inset-e-4 md:inset-e-8 z-50">
      <span
        className=" text-xs text-gray-300 px-3 py-1 rounded shadow border border-gray-200 font-semibold select-none"
        style={{ letterSpacing: "0.04em" }}
      >
        Powered by{" "}
        <span className="text-(--marketing-color-primary)">WeddWeb</span>
      </span>
    </div>
  );
}
