export default function ProductLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f1f7f0] px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 rounded-2xl bg-white p-6 md:grid-cols-2">
        <div className="h-80 rounded-xl bg-gray-200" />

        <div className="space-y-5 py-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-5 w-1/2 rounded bg-gray-200" />
          <div className="h-10 w-1/3 rounded bg-gray-200" />
          <div className="h-24 rounded bg-gray-200" />
          <div className="h-12 w-40 rounded-lg bg-gray-200" />
        </div>
      </div>
    </main>
  );
}