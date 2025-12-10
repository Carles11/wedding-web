export default function MarketingLanding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <h1 className="text-5xl font-extrabold mb-4 text-primary">
        Welcome to WeddWeb
      </h1>
      <p className="text-lg text-gray-800 max-w-lg text-center mb-8">
        Build your own beautiful, multilingual wedding/event website.
        <br />
        Try it now or contact us for a demo!
      </p>
      <a
        href="mailto:hello@weddweb.com"
        className="px-6 py-3 bg-black text-white rounded font-bold shadow hover:bg-gray-900 transition"
      >
        Get Started
      </a>
    </main>
  );
}
