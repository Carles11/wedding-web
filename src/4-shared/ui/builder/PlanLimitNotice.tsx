type PlanLimitNoticeProps = {
  message: string;
  upgradeLabel: string;
  onUpgrade: () => void;
};

export function PlanLimitNotice({
  message,
  upgradeLabel,
  onUpgrade,
}: PlanLimitNoticeProps) {
  return (
    <div className="mt-3 text-sm text-gray-600">
      {message}{" "}
      <button
        type="button"
        className="builder-link-action cursor-pointer"
        onClick={onUpgrade}
      >
        {upgradeLabel}
      </button>
    </div>
  );
}
