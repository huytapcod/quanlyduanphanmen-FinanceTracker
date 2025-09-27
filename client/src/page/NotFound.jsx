export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <p className="opacity-70 dark:text-slate-300 mt-2">Page not found</p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
