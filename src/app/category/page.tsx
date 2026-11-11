"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react";
import { getProducts } from "../lib/api";
import ProductImage from "@/components/ProductImage";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type Category = {
  id: string;
  name: string;
  icon: string;
};

function getProductList(data: any): Product[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
}

function getCategoryIcon(icon: string): string {
  const iconFallback: Record<string, string> = {
    "🫘": "🥜",
  };

  return iconFallback[icon] || icon;
}

export default function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
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

  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, Category>();

    products.forEach((product) => {
      if (product.category && !uniqueCategories.has(product.category)) {
        uniqueCategories.set(product.category, {
          id: product.category,
          name: product.categoryNameBn,
          icon: product.categoryIcon,
        });
      }
    });

    return Array.from(uniqueCategories.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      result = result.filter((product) =>
        product.nameBn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "low-high") {
      result.sort((a, b) => a.today - b.today);
    }

    if (sortOrder === "high-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortOrder]);

  return (
    <main>
      {/* Category Hero */}
      <section className="category-hero">
        <div className="container">
          <span className="eyebrow">EXPLORE PRODUCTS</span>
          <h1>পণ্যের ক্যাটাগরি</h1>
          <p>
            আপনার প্রয়োজনীয় পণ্য খুঁজুন এবং বর্তমান বাজারদর জেনে নিন।
          </p>
        </div>
      </section>

      {/* Category Content */}
      <section className="container category-page-section">
        {/* Search and Sort */}
        <div className="category-toolbar">
          <div className="category-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="পণ্যের নাম লিখে খুঁজুন..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="category-sort">
            <ArrowDownUp size={17} />
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sort products by price"
            >
              <option value="default">সাধারণ ক্রম</option>
              <option value="low-high">দাম: কম থেকে বেশি</option>
              <option value="high-low">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="category-filter">
          <button
            type="button"
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            সব পণ্য
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={selectedCategory === category.id ? "active" : ""}
              onClick={() => setSelectedCategory(category.id)}
            >
              {getCategoryIcon(category.icon)} {category.name}
            </button>
          ))}
        </div>

        {/* Results Heading */}
        <div className="category-results-heading">
          <div>
            <h2>
              {selectedCategory === "all"
                ? "সকল পণ্য"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p>
              {filteredProducts.length.toLocaleString("bn-BD")}টি পণ্য পাওয়া গেছে
            </p>
          </div>
        </div>

        {/* Product Display */}
        {loading ? (
          <div className="status-box">পণ্যের তথ্য লোড হচ্ছে...</div>
        ) : error ? (
          <div className="status-box">
            পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="status-box">কোনো পণ্য পাওয়া যায়নি।</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className="product-image"
                >
                  <ProductImage
                    image={product.image}
                    alt={product.nameBn}
                  />
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
                    ৳{Number(product.today).toLocaleString("bn-BD")}
                  </strong>

                  {product.change.dir === "up" ? (
                    <span className="price-up">
                      <ArrowUpRight size={15} />
                      {product.change.pct.toLocaleString("bn-BD")}%
                    </span>
                  ) : product.change.dir === "down" ? (
                    <span className="price-down">
                      <ArrowDownRight size={15} />
                      {Math.abs(product.change.pct).toLocaleString("bn-BD")}%
                    </span>
                  ) : (
                    <span className="muted">পরিবর্তন নেই</span>
                  )}
                </div>

                <p className="product-unit">
                  প্রতি{" "}
                  {product.unit === "kg"
                    ? "কেজি"
                    : product.unit === "litre"
                      ? "লিটার"
                      : product.unit}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="category-back-link">
          <Link href="/">
            <ArrowRight size={17} />
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}