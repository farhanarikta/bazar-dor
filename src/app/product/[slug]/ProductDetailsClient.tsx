"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  ShoppingBasket,
} from "lucide-react";

import { getProducts } from "../../lib/api";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
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
  if (Array.isArray(data?.products)) return data.products;
  return [];
}

export default function ProductDetailsClient() {
  const params = useParams();
  const slug = String(params.slug);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchProduct() {
      try {
        const data = await getProducts();
        const products = getProductList(data);

        const foundProduct = products.find(
          (item) => item.slug === slug || String(item.id) === slug
        );

        if (active && foundProduct) {
          setProduct(foundProduct);
        } else if (active) {
          setError(true);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="container products-section">
        <div className="status-box">পণ্যের তথ্য লোড হচ্ছে...</div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container products-section">
        <div className="status-box">
          <h2>পণ্যটি পাওয়া যায়নি</h2>
          <p>দয়া করে আবার চেষ্টা করুন।</p>
          <Link href="/category" className="button button-primary">
            ক্যাটাগরিতে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const direction =
    product.change?.dir ??
    (product.today > product.yesterday
      ? "up"
      : product.today < product.yesterday
        ? "down"
        : "flat");

  const imageIsUrl =
    product.image?.startsWith("http://") ||
    product.image?.startsWith("https://");

  return (
    <main className="container product-details-section">
      <Link href="/category" className="back-link">
        <ArrowLeft size={18} />
        সব পণ্যে ফিরে যান
      </Link>

      <div className="product-details-card">
        <div className="product-details-image">
          {imageIsUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.nameBn} />
          ) : (
            <span className="product-details-emoji">
              {product.image || "🛒"}
            </span>
          )}
        </div>

        <div className="product-details-content">
          <span className="eyebrow">
            {product.categoryNameBn || product.category}
          </span>

          <h1>{product.nameBn}</h1>

          <p className="details-unit">
            প্রতি{" "}
            {product.unit === "kg"
              ? "কেজি"
              : product.unit === "litre"
                ? "লিটার"
                : product.unit}
          </p>

          <div className="details-price">
            ৳{Number(product.today).toLocaleString("en-BD")}
          </div>

          <p className="details-label">বর্তমান বাজারদর</p>

          <div className="details-price-change">
            {direction === "up" ? (
              <span className="price-up">
                <ArrowUpRight size={18} />
                দাম বেড়েছে
              </span>
            ) : direction === "down" ? (
              <span className="price-down">
                <ArrowDownRight size={18} />
                দাম কমেছে
              </span>
            ) : (
              <span className="muted">দামের পরিবর্তন নেই</span>
            )}
          </div>

          <div className="price-history">
            <div>
              <span>গতকালের দাম</span>
              <strong>
                ৳{Number(product.yesterday).toLocaleString("en-BD")}
              </strong>
            </div>

            {product.lastWeek !== undefined && (
              <div>
                <span>গত সপ্তাহের দাম</span>
                <strong>
                  ৳{Number(product.lastWeek).toLocaleString("en-BD")}
                </strong>
              </div>
            )}

            {product.lastMonth !== undefined && (
              <div>
                <span>গত মাসের দাম</span>
                <strong>
                  ৳{Number(product.lastMonth).toLocaleString("en-BD")}
                </strong>
              </div>
            )}
          </div>

          <Link href="/category" className="button button-primary">
            <ShoppingBasket size={18} />
            অন্যান্য পণ্য দেখুন
          </Link>
        </div>
      </div>
    </main>
  );
}