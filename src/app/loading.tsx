export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f1f7f0] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-56 rounded-2xl bg-gray-200" />

        <div className="mb-6 h-8 w-48 rounded bg-gray-200" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-4 h-36 rounded-lg bg-gray-200" />
              <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mb-3 h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-9 rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}