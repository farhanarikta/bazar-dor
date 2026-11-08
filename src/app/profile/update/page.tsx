"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, authClient } from "@/app/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }

    if (session) {
      setName(session.user.name || "");
    }
  }, [session, isPending, router]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(result.error.message || "Update failed.");
        return;
      }

      toast.success("Information updated successfully!");

      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f7f0]">
        <p className="text-[#173b2a]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f1f7f0] px-4 py-12">
      <Toaster position="top-center" />

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-[#173b2a]">
          Update Information
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500">
          Update your Bazar Dor profile name.
        </p>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#173b2a]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#173b2a] p-3 font-semibold text-white transition hover:bg-[#24543b] disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Information"}
          </button>
        </form>

        <Link
          href="/profile"
          className="mt-5 block text-center text-sm font-medium text-[#173b2a]"
        >
          Back to Profile
        </Link>
      </div>
    </main>
  );
}