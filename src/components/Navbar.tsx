"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  UserRound,
  ShoppingBasket,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">
            <ShoppingBasket size={23} />
          </span>

          <span className="brand-text">
            <span className="brand-name">Bazar Dor</span>
            <span className="brand-tagline">আপনার নিত্যবাজার</span>
          </span>
        </Link>

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

          <div className="mobile-auth-links">
            <Link href="/sign-in" onClick={closeMenu}>
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="navbar-signup"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-icon-button"
            aria-label="Go to products"
            onClick={() => {
              document.getElementById("products")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <Search size={19} />
          </button>

          <Link href="/sign-in" className="navbar-signin">
            <UserRound size={17} />
            <span>Sign In</span>
          </Link>

          <Link href="/sign-up" className="navbar-signup desktop-signup">
            Sign Up
          </Link>

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