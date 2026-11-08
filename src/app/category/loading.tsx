export default function CategoryLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f1f7f0] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-9 w-56 rounded bg-gray-200" />

        <div className="mb-8 flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 w-28 rounded-full bg-gray-200" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-xl bg-white p-4">
              <div className="mb-4 h-36 rounded-lg bg-gray-200" />
              <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}