import Heading from "@/4-shared/ui/commons/typography/Heading";

interface TenantNotFoundStateProps {
  host: string;
  translations: Record<string, string>;
}

export default function TenantNotFoundState({
  host,
  translations,
}: TenantNotFoundStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] p-8">
      <Heading as="h1" className="text-3xl md:text-4xl mb-4 text-red-700">
        {translations["event_not_found_title"] ?? "Wedding Event Not Found"}
      </Heading>
      <p className="text-lg text-gray-600 max-w-lg text-center">
        {translations["event_not_found_body"] ??
          "This wedding website is not yet published or available for this domain:"}{" "}
        <strong>{host}</strong>
      </p>
    </div>
  );
}
