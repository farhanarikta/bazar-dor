"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, authClient } from "@/app/lib/auth-client";
import {
  UserRound,
  Mail,
  Edit,
  Camera,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session, isPending } = useSession();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [session, isPending, router]);

  async function handlePhotoUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      // Resize image before saving
      const imageBitmap = await createImageBitmap(file);

      const canvas = document.createElement("canvas");
      const size = 320;

      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to process image.");
      }

      const scale = Math.max(
        size / imageBitmap.width,
        size / imageBitmap.height
      );

      const width = imageBitmap.width * scale;
      const height = imageBitmap.height * scale;

      context.drawImage(
        imageBitmap,
        (size - width) / 2,
        (size - height) / 2,
        width,
        height
      );

      imageBitmap.close();

      const imageData = canvas.toDataURL("image/jpeg", 0.75);

      const result = await authClient.updateUser({
        image: imageData,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Photo upload failed."
        );
      }

      toast.success("Profile photo updated!");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not upload photo."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f1f7f0]">
        <p className="text-[#173b2a]">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f7f0] px-4 py-16">
      <Toaster position="top-center" />

      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-lg">

        {/* Profile Header */}
        <div className="mb-8 text-center">

          {/* Profile Photo */}
          <div className="relative mx-auto mb-4 h-28 w-28">

            {session.user.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-[#e5f0e5] object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#e5f0e5] text-[#173b2a]">
                <UserRound size={48} />
              </div>
            )}

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Upload profile photo"
              className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#173b2a] text-white shadow-md hover:bg-[#24543b] disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Camera size={18} />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <p className="mb-4 text-xs text-gray-500">
            Click the camera icon to upload a profile photo.
            <br />
            Maximum image size: 5 MB.
          </p>

          <h1 className="text-2xl font-bold text-[#173b2a]">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your account information
          </p>
        </div>

        {/* User Information */}
        <div className="space-y-5">

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-sm text-gray-500">
              Full Name
            </p>

            <div className="flex items-center gap-3 font-semibold text-[#173b2a]">
              <UserRound size={19} />
              {session.user.name}
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-sm text-gray-500">
              Email Address
            </p>

            <div className="flex items-center gap-3 font-semibold text-[#173b2a]">
              <Mail size={19} />
              {session.user.email}
            </div>
          </div>

        </div>

        {/* Update Profile */}
        <Link
          href="/profile/update"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#173b2a] px-5 py-3 font-semibold text-white transition hover:bg-[#24543b]"
        >
          <Edit size={18} />
          Update Information
        </Link>

        <Link
          href="/"
          className="mt-4 block text-center text-sm font-medium text-[#173b2a]"
        >
          Back to Home
        </Link>

      </div>
    </main>
  );
}