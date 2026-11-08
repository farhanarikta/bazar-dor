"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  UserRound,
  ShoppingBasket,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "@/app/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Prevent server/client hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await signOut();

      closeMenu();
      toast.success("Logged out successfully!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }

  const authLinks = (
    <>
      {mounted && !isPending && (
        session ? (
          <>
            <span className="px-2 text-sm font-medium text-[#173b2a]">
              {session.user.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-[#173b2a] hover:bg-gray-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              onClick={closeMenu}
              className="navbar-signin"
            >
              <UserRound size={17} />
              <span>Sign In</span>
            </Link>

            <Link
              href="/signup"
              className="navbar-signup desktop-signup"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </>
        )
      )}
    </>
  );

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link
          href="/"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <span className="brand-icon">
            <ShoppingBasket size={23} />
          </span>

          <span className="brand-text">
            <span className="brand-name">Bazar Dor</span>
            <span className="brand-tagline">আপনার নিত্যবাজার</span>
          </span>
        </Link>

        {/* Navigation links */}
        <nav className={`navbar-links ${menuOpen ? "menu-open" : ""}`}>
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/category" onClick={closeMenu}>
            Categories
          </Link>

          <Link href="/#products" onClick={closeMenu}>
            All Products
          </Link>

          {/* Mobile authentication links */}
          <div className="mobile-auth-links">
            {mounted && !isPending && (
              session ? (
                <>
                  <span className="px-2 text-sm font-medium text-[#173b2a]">
                    {session.user.name}
                  </span>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-2"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={closeMenu}>
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="navbar-signup"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </nav>

        {/* Right-side actions */}
        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-icon-button"
            aria-label="Go to products"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Search size={19} />
          </button>

          {/* Desktop authentication links */}
          <div className="hidden md:flex items-center gap-3">
            {authLinks}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="navbar-menu-button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}