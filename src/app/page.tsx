export default function MarketingLanding() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-gray-100 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 mx-auto">
            <span className="inline-block text-[2.5rem] leading-none text-pink-500 font-extrabold tracking-tight">
              💍
            </span>
            <span className="inline-block text-[2.5rem] leading-none text-indigo-600 font-extrabold tracking-tight">
              WeddWeb
            </span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          A new platform for event & wedding websites
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          <span className="block font-semibold text-pink-500 text-xl animate-pulse mb-2">
            Coming soon!
          </span>
          The all-in-one tool for beautiful, multilingual wedding and event
          sites is under construction.
          <br />
          Launching shortly—stay tuned!
        </p>
        <div className="flex flex-col justify-center items-center gap-2 mb-6">
          <span className="flex items-center text-gray-500">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Updates? Email{" "}
            <a
              href="mailto:carles@rio-frances.com"
              className="underline text-indigo-600 font-bold ml-1"
            >
              carles@rio-frances.com
            </a>
          </span>
        </div>
        <button
          className="inline-block px-7 py-3 bg-indigo-600 text-white text-lg rounded-full font-bold shadow-md hover:bg-pink-500 focus:outline-none transition"
          disabled
        >
          🚧 Under Construction 🚧
        </button>
      </div>
    </main>
  );
}
