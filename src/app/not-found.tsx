import Link from "next/link";
import { ShoppingBasket, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f1f7f0] px-4">
      <div className="max-w-md text-center">
        <div className="mb-5 flex justify-center">
          <div className="rounded-full bg-[#e5f0e5] p-6 text-[#173b2a]">
            <ShoppingBasket size={48} />
          </div>
        </div>

        <h1 className="text-7xl font-extrabold text-[#173b2a]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-[#173b2a]">
          Page Not Found!
        </h2>

        <p className="mt-3 text-gray-600">
          Sorry, the page you are looking for doesn't exist
          or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#173b2a] px-6 py-3 font-semibold text-white hover:bg-[#24543b]"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}