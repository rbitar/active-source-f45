'use client';

import React from 'react';
import Link from 'next/link';
import { getColorHex } from '@/lib/colors';
import { Badge } from '@/components/ui/badge';

interface ProductImage {
  url: string;
  altText?: string;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
  selectedOptions?: Array<{ name: string; value: string }>;
}

interface ProductMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

interface ProductOptionValue {
  id: string;
  name: string;
  swatch?: {
    color?: string | null;
    image?: { previewImage?: { url: string } | null } | null;
  } | null;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  handle: string;
  images: {
    edges: Array<{ node: ProductImage }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{ node: ProductVariant }>;
  };
  options?: Array<{
    name: string;
    values: string[];
    optionValues?: ProductOptionValue[];
  }>;
  metafields?: (ProductMetafield | null)[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const firstImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  const formatPrice = (p: ProductPrice) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: p.currencyCode,
    }).format(parseFloat(p.amount));

  const sizeOption = product.options?.find(
    (o) => o.name.toLowerCase() === 'size'
  );
  const colorOption = product.options?.find(
    (o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour'
  );

  const sizeRange =
    sizeOption && sizeOption.values.length > 0
      ? sizeOption.values.length === 1
        ? sizeOption.values[0]
        : `${sizeOption.values[0]} - ${sizeOption.values[sizeOption.values.length - 1]}`
      : null;

  // Use optionValues (with swatch) if available, else fall back to flat values array
  const colorOptionValues =
    colorOption?.optionValues ??
    colorOption?.values.map((v) => ({ id: v, name: v, swatch: null })) ??
    [];
  const firstFiveColorValues = colorOptionValues.slice(0, 5);

  return (
    <Link
      href={`/shop/products/${product.handle}`}
      className="block group bg-white"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.altText || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            ?
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col">
        {/* Fixed-height content area: title + colors + size (slightly expanded) */}
        <div className="h-20 flex flex-col justify-start gap-1.5 overflow-hidden">
          <p className="text-[15px] font-semibold text-[#2e2e2e] leading-snug line-clamp-2">
            {product.title}
          </p>

          {/* Color swatches - first 5 colors as dots */}
          {firstFiveColorValues.length > 0 && (
            <div className="flex items-center gap-1.5">
              {firstFiveColorValues.map((ov) => {
                // Prefer Shopify swatch color → swatch image → local color map → fallback
                const swatchColor = ov.swatch?.color;
                const swatchImageUrl = ov.swatch?.image?.previewImage?.url;
                const localHex = getColorHex(ov.name);
                return (
                  <div
                    key={ov.id}
                    className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0 shadow-sm"
                    style={
                      swatchImageUrl
                        ? {
                            backgroundImage: `url(${swatchImageUrl})`,
                            backgroundSize: 'cover',
                          }
                        : {
                            backgroundColor:
                              swatchColor ?? localHex ?? '#d1d5db',
                          }
                    }
                    title={ov.name}
                  />
                );
              })}
              {colorOptionValues.length > 5 && (
                <span className="text-[10px] text-[#b4b4b4] font-medium">
                  +{colorOptionValues.length - 5}
                </span>
              )}
            </div>
          )}

          {sizeRange && (
            <p className="text-[11px] text-[#b4b4b4]">{sizeRange}</p>
          )}
        </div>

        {/* Price always at the bottom */}
        <p className="text-[13px] font-semibold text-[#2e2e2e] mt-2">
          {formatPrice(price)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
