'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getColorHex } from '@/lib/colors';
import BulkOrderSheet from './bulk-order-sheet';
import { getMetafieldValue } from '@/hooks/use-shopify-products';
import EnterpriseEnquiryDialog from '@/components/shopify/enterprise-enquiry-dialog';

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: ProductPrice;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface ProductOptionValue {
  id: string;
  name: string;
  swatch?: {
    color?: string | null;
    image?: { previewImage?: { url: string } | null } | null;
  } | null;
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
  optionValues?: ProductOptionValue[];
}

interface ProductMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  handle: string;
  vendor?: string;
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  options: ProductOption[];
  variants: {
    edges: Array<{ node: ProductVariant }>;
  };
  metafields?: (ProductMetafield | null)[];
}

interface ProductDetailInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  selectedOptions: Record<string, string>;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
  onOptionChange: (optionName: string, value: string) => void;
  loading?: boolean;
  note: string;
  setNote: (note: string) => void;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  product,
  selectedVariant,
  selectedOptions,
  quantity,
  setQuantity,
  handleAddToCart,
  onOptionChange,
  loading,
  note,
  setNote,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const formatPrice = (price: ProductPrice) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(price.amount));

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const minPrice = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const isColorOption = (name: string) => name.toLowerCase() === 'color';
  const allVariants = product.variants.edges.map((e) => e.node);

  // Metafield helpers
  const isEnterprise =
    product.metafields?.find((m) => m?.key === 'is_enterprise')?.value ===
    'true';

  const enableNotes =
    product.metafields?.find((m) => m?.key === 'enable_notes')?.value ===
    'true';

  const moq = getMetafieldValue(product.metafields, 'moq');
  const technique = getMetafieldValue(product.metafields, 'technique');
  const minQuantity = getMetafieldValue(product.metafields, 'min_quantity');
  const enterpriseDescription = getMetafieldValue(
    product.metafields,
    'enterprise_product_description'
  );

  // Parse plain-text description into bullet lines (lines starting with "-")
  // and non-bullet lines for MOQ/Technique fallback
  const descriptionLines = (product.description ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const bulletLines = descriptionLines.filter((l) => l.startsWith('-'));

  // Try to extract MOQ / Technique from description if not in metafields
  const moqLine =
    moq ??
    descriptionLines
      .find((l) => l.toLowerCase().startsWith('moq'))
      ?.replace(/^moq[:\s]*/i, '') ??
    null;
  const techniqueLine =
    technique ??
    descriptionLines
      .find((l) => l.toLowerCase().startsWith('technique'))
      ?.replace(/^technique[:\s]*/i, '') ??
    null;

  // ── Enterprise layout ────────────────────────────────────────────────────────
  if (isEnterprise) {
    return (
      <>
        <div className="flex flex-col gap-0">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-5">
            {product.title}
          </h1>

          {/* Brand */}
          {product.vendor && (
            <p className="text-sm text-gray-800 mb-3">
              <span className="font-bold">Brand:</span> {product.vendor}
            </p>
          )}

          {/* Minimum Quantity */}
          {minQuantity && (
            <p className="text-sm text-gray-800 mb-3">
              <span className="font-bold">Minimum Quantity:</span> {minQuantity}
            </p>
          )}

          {/* Price */}
          <p className="text-sm text-gray-800 mb-3">
            <span className="font-bold">Starting from</span>{' '}
            {formatPrice(minPrice)}
          </p>

          {/* MOQ + Technique */}
          {(moqLine || techniqueLine) && (
            <div className="mb-4 flex flex-col gap-0.5">
              {moqLine && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">MOQ:</span> {moqLine}
                </p>
              )}
              {techniqueLine && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Technique:</span>{' '}
                  {techniqueLine}
                </p>
              )}
            </div>
          )}

          {/* Bullet spec lines */}
          {bulletLines.length > 0 && (
            <ul className="flex flex-col gap-0.5 mb-8">
              {bulletLines.map((line, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {line}
                </li>
              ))}
            </ul>
          )}

          {/* Enterprise product description */}
          {enterpriseDescription && (
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {enterpriseDescription}
            </p>
          )}

          {/* If no bullets and no description, show a spacer so button isn't crammed */}
          {bulletLines.length === 0 && !enterpriseDescription && (
            <div className="mb-6" />
          )}

          {/* CTA */}
          <Button
            onClick={() => setEnquiryOpen(true)}
            size="lg"
            className="w-full rounded-full py-6 text-base font-semibold bg-enterprise hover:bg-enterprise/90 text-enterprise-foreground"
          >
            Contact Us Now
          </Button>
        </div>

        {/* Enterprise enquiry dialog */}
        <EnterpriseEnquiryDialog
          open={enquiryOpen}
          onOpenChange={setEnquiryOpen}
          productTitle={product.title}
          productHandle={product.handle}
        />
      </>
    );
  }

  // ── Standard layout ──────────────────────────────────────────────────────────
  return (
    <>
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
          {product.title}
        </h1>

        {/* Price */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {hasDiscount && compareAtPrice && (
            <>
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(compareAtPrice)}
              </span>
              <Badge variant="destructive">
                {Math.round(
                  ((parseFloat(compareAtPrice.amount) -
                    parseFloat(price.amount)) /
                    parseFloat(compareAtPrice.amount)) *
                    100
                )}
                % OFF
              </Badge>
            </>
          )}
        </div>

        {/* Product Options */}
        {product.options.map((option) => {
          const isColor = isColorOption(option.name);
          return (
            <div key={option.id} className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {option.name}
                {isColor && selectedOptions[option.name] && (
                  <span className="ml-2 font-normal text-gray-500">
                    {selectedOptions[option.name]}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {isColor
                  ? (
                      option.optionValues ??
                      option.values.map((v) => ({
                        id: v,
                        name: v,
                        swatch: null,
                      }))
                    ).map((ov) => {
                      const swatchColor = ov.swatch?.color;
                      const swatchImageUrl =
                        ov.swatch?.image?.previewImage?.url;
                      const localHex = getColorHex(ov.name);
                      const isSelected =
                        selectedOptions[option.name] === ov.name;
                      return (
                        <button
                          key={ov.id}
                          title={ov.name}
                          onClick={() => onOptionChange(option.name, ov.name)}
                          className={`w-9 h-9 rounded-full border ${
                            isSelected
                              ? 'ring-2 ring-black ring-offset-1 border-transparent'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                          style={
                            swatchImageUrl
                              ? {
                                  backgroundImage: `url(${swatchImageUrl})`,
                                  backgroundSize: 'cover',
                                }
                              : {
                                  backgroundColor:
                                    swatchColor ?? localHex ?? '#e5e7eb',
                                }
                          }
                        />
                      );
                    })
                  : option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => onOptionChange(option.name, value)}
                          className={`h-9 px-4 rounded-full text-sm font-medium border ${
                            isSelected
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
              </div>
            </div>
          );
        })}

        {/* Customization / Notes */}
        {enableNotes && (
          <div className="mb-6">
            <p className="text-base font-bold text-gray-900 mb-2">
              Customization
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-1">
              Create your own signature F45 Cityscape tee. Simply share your
              studio name, city, state and design vision via the customization
              field below and our team will craft a custom graphic that captures
              your location in style.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Should you have any questions at all, please contact support at{' '}
              <a
                href="mailto:F45@activesourcelab.com"
                className="text-gray-700 underline"
              >
                F45@activesourcelab.com
              </a>
              .
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add notes to your order"
              rows={4}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
            />
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="mb-8 flex items-center gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black text-lg leading-none"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium text-gray-900 select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black text-lg leading-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <Button
            onClick={() => setSheetOpen(true)}
            size="lg"
            disabled={loading}
            className="flex-1 text-base font-bold rounded-full py-6 bg-black hover:bg-gray-900 text-white"
          >
            {loading ? 'Adding…' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <BulkOrderSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        variants={allVariants}
        selectedOptions={selectedOptions}
        basePrice={product.priceRange.minVariantPrice}
        note={note}
        minUnits={minQuantity ? parseInt(minQuantity, 10) : undefined}
        initialQuantities={
          selectedVariant && quantity > 0
            ? { [selectedVariant.id]: quantity }
            : undefined
        }
        metafieldAttributes={[
          'front_dimensions',
          'front_note',
          'back_dimensions',
          'back_note',
          'cost',
        ]
          .map((key) => ({
            key: `_${key}`,
            value: getMetafieldValue(product.metafields, key),
          }))
          .filter((a): a is { key: string; value: string } => a.value !== null)}
      />
    </>
  );
};

export default ProductDetailInfo;
