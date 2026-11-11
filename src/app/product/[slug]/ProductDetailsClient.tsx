"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  ShoppingBasket,
  MapPin,
} from "lucide-react";

import { getProducts } from "../../lib/api";
import ProductImage from "@/components/ProductImage";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

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
  markets?: Market[];
};

function getProductList(data: any): Product[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
}

function formatPrice(value: number) {
  return `৳${Number(value).toLocaleString("bn-BD")}`;
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

  const markets = product.markets ?? [];

  const lowestPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : null;

  const highestPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : null;

  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (total, market) => total + (market.min + market.max) / 2,
          0
        ) / markets.length
      : null;

  return (
    <main className="container product-details-section">
      <Link href="/category" className="back-link">
        <ArrowLeft size={18} />
        সব পণ্যে ফিরে যান
      </Link>

      <div className="product-details-card">
        <div className="product-details-image">
          <ProductImage
            image={product.image}
            alt={product.nameBn}
            fallbackClassName="product-details-emoji"
          />
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
            {formatPrice(product.today)}
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
              <strong>{formatPrice(product.yesterday)}</strong>
            </div>

            {product.lastWeek !== undefined && (
              <div>
                <span>গত সপ্তাহের দাম</span>
                <strong>{formatPrice(product.lastWeek)}</strong>
              </div>
            )}

            {product.lastMonth !== undefined && (
              <div>
                <span>গত মাসের দাম</span>
                <strong>{formatPrice(product.lastMonth)}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {markets.length > 0 && (
        <>
          <section className="price-history-section">
            <h2>বাজারদরের সারসংক্ষেপ</h2>

            <div className="price-history">
              <div>
                <span>সর্বনিম্ন দাম</span>
                <strong>
                  {lowestPrice !== null ? formatPrice(lowestPrice) : "—"}
                </strong>
              </div>

              <div>
                <span>সর্বোচ্চ দাম</span>
                <strong>
                  {highestPrice !== null ? formatPrice(highestPrice) : "—"}
                </strong>
              </div>

              <div>
                <span>গড় দাম (আনুমানিক)</span>
                <strong>
                  {averagePrice !== null
                    ? formatPrice(Math.round(averagePrice))
                    : "—"}
                </strong>
              </div>
            </div>

            <p className="muted">
              গড় দাম প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দু
              থেকে হিসাব করা হয়েছে।
            </p>
          </section>

          <section className="market-prices-section">
            <h2>বাজারভিত্তিক দাম</h2>

            <div className="market-prices-list">
              {markets.map((market, index) => (
                <div
                  className="market-price-card"
                  key={`${market.market}-${index}`}
                >
                  <div className="market-info">
                    <h3>{market.market}</h3>
                    <p>
                      <MapPin size={14} />
                      {market.division}
                    </p>
                  </div>

                  <div className="market-price-range">
                    <span>সর্বনিম্ন</span>
                    <strong>{formatPrice(market.min)}</strong>
                  </div>

                  <div className="market-price-range">
                    <span>সর্বোচ্চ</span>
                    <strong>{formatPrice(market.max)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <Link href="/category" className="button button-primary">
        <ShoppingBasket size={18} />
        অন্যান্য পণ্য দেখুন
      </Link>
    </main>
  );
}