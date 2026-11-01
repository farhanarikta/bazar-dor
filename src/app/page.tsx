"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ShoppingBasket,
} from "lucide-react";

import { getProducts } from "./lib/api";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon?: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

function getProductList(data: any): Product[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.products)) return data.products;

  return [];
}

function getDirection(product: Product) {
  if (product.change?.dir) return product.change.dir;

  if (product.today > product.yesterday) return "up";
  if (product.today < product.yesterday) return "down";

  return "flat";
}

function getPriceChange(product: Product) {
  return Math.abs(product.today - product.yesterday);
}

function ProductCard({ product }: { product: Product }) {
  const direction = getDirection(product);

  const isImageUrl =
    product.image?.startsWith("http://") ||
    product.image?.startsWith("https://");

  return (
    <article className="product-card" key={product.id}>
      <Link
        href={`/product/${product.slug}`}
        className="product-image"
      >
        {isImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.nameBn} />
        ) : (
          <span className="product-placeholder product-emoji">
            {product.image || "🛒"}
          </span>
        )}
      </Link>

      <p className="product-category">
        {product.categoryNameBn}
      </p>

      <h3 className="product-name">
        <Link href={`/product/${product.slug}`}>
          {product.nameBn}
        </Link>
      </h3>

      <div className="product-price-row">
        <strong>
          ৳{Number(product.today).toLocaleString("en-BD")}
        </strong>

        {direction === "up" ? (
          <span className="price-up">
            <ArrowUpRight size={15} />
            ৳{getPriceChange(product).toLocaleString("en-BD")}
          </span>
        ) : direction === "down" ? (
          <span className="price-down">
            <ArrowDownRight size={15} />
            ৳{getPriceChange(product).toLocaleString("en-BD")}
          </span>
        ) : (
          <span className="muted">পরিবর্তন নেই</span>
        )}
      </div>

      <p className="product-unit">
        প্রতি {product.unit === "kg"
          ? "কেজি"
          : product.unit === "litre"
            ? "লিটার"
            : product.unit}
      </p>
    </article>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data: any) => {
        if (!active) return;
        setProducts(getProductList(data));
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const increased = products.filter(
    (product) => getDirection(product) === "up"
  );

  const decreased = products.filter(
    (product) => getDirection(product) === "down"
  );

  return (
    <main>
      {/* Market Ticker */}
      <div className="price-ticker">
        <div className="container ticker-inner">
          <span className="ticker-label">আজকের বাজারদর</span>
          <span>নিত্যপণ্যের দাম এক নজরে দেখুন</span>
          <Link href="/category">সব পণ্য দেখুন ↗</Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-badge">
              আপনার বিশ্বস্ত বাজার সহকারী
            </span>

            <h1>
              প্রতিদিনের বাজারদর,
              <br />
              <span>এখন আপনার হাতেই</span>
            </h1>

            <p>
              চাল, ডাল, তেলসহ নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ দাম
              জানুন। বাজারে যাওয়ার আগেই পরিকল্পনা করুন আপনার
              কেনাকাটা।
            </p>

            <div className="hero-actions">
              <a href="#products" className="button button-primary">
                বাজারদর দেখুন <ArrowRight size={18} />
              </a>

              <Link href="/category" className="button button-outline">
                ক্যাটাগরি দেখুন
              </Link>
            </div>

            <div className="hero-note">
              ✓ সহজে দাম দেখুন &nbsp; ✓ পরিকল্পিত কেনাকাটা
            </div>
          </div>

          <div className="hero-visual">
            {/* Your existing hero image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero.png"
              alt="Bazar Dor market illustration"
              className="hero-image"
            />

            <div className="hero-price-card">
              <span>বাজারদর</span>
              <strong>এক জায়গায়</strong>
              <small>আপনার দৈনন্দিন সঙ্গী</small>
            </div>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section
        className="container products-section"
        id="products"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">MARKET OVERVIEW</span>
            <h2 className="section-title">আজকের বাজারদর</h2>
            <p className="section-description">
              সব নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর দেখুন।
            </p>
          </div>

          <Link href="/category" className="view-all">
            সব পণ্য দেখুন <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="status-box">
            পণ্যের তথ্য লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="status-box">
            পণ্যের তথ্য লোড করা যায়নি। পৃষ্ঠাটি রিফ্রেশ করে আবার
            চেষ্টা করুন।
          </div>
        ) : products.length === 0 ? (
          <div className="status-box">
            এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <div className="category-back-link">
              <Link href="/category">
                সব ক্যাটাগরি ও পণ্য দেখুন
                <ArrowRight size={17} />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Price Increased */}
      {!loading && !error && increased.length > 0 && (
        <section className="container products-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PRICE INCREASE</span>
              <h2 className="section-title">
                দাম বেড়েছে <span className="price-up">↗</span>
              </h2>
            </div>
          </div>

          <div className="product-grid">
            {increased.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {/* Price Decreased */}
      {!loading && !error && decreased.length > 0 && (
        <section className="container products-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PRICE DECREASE</span>
              <h2 className="section-title">
                দাম কমেছে <span className="price-down">↘</span>
              </h2>
            </div>
          </div>

          <div className="product-grid">
            {decreased.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="container market-cta">
        <div>
          <span className="eyebrow">
            SMART SHOPPING STARTS HERE
          </span>

          <h2>বাজার করুন জেনে-বুঝে</h2>

          <p>
            দাম যাচাই করুন, কেনাকাটার পরিকল্পনা করুন, সাশ্রয়ী থাকুন।
          </p>
        </div>

        <Link href="/category" className="button button-light">
          পণ্য ব্রাউজ করুন <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong className="footer-brand">
              <ShoppingBasket size={21} /> Bazar Dor
            </strong>

            <p>আপনার নিত্যবাজার, আপনার হাতেই।</p>
          </div>

          <div className="footer-links">
            <Link href="/">হোম</Link>
            <Link href="/category">ক্যাটাগরি</Link>
            <Link href="/sign-in">সাইন ইন</Link>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Bazar Dor
          </p>
        </div>
      </footer>
    </main>
  );
}