'use client';

import React, { useState, useMemo } from 'react';
import { RiAddLine, RiSubtractLine, RiCloseLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useShopifyCart } from '@/hooks/use-shopify-cart';

const DEFAULT_MIN_UNITS = 12;

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ProductPrice;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface LineAttribute {
  key: string;
  value: string;
}

interface BulkOrderSheetProps {
  open: boolean;
  onClose: () => void;
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  basePrice: ProductPrice;
  metafieldAttributes?: LineAttribute[];
  initialQuantities?: Record<string, number>;
  note?: string;
  minUnits?: number;
}

export default function BulkOrderSheet({
  open,
  onClose,
  variants,
  selectedOptions,
  basePrice,
  metafieldAttributes = [],
  initialQuantities,
  note,
  minUnits = DEFAULT_MIN_UNITS,
}: BulkOrderSheetProps) {
  const { addItems, openCart } = useShopifyCart();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    initialQuantities ?? {}
  );
  const [loading, setLoading] = useState(false);

  // Re-seed quantities whenever the sheet opens with new initial values
  const prevOpen = React.useRef(false);
  React.useEffect(() => {
    if (open && !prevOpen.current) {
      setQuantities(initialQuantities ?? {});
    }
    prevOpen.current = open;
  }, [open, initialQuantities]);

  // Filter variants by current non-size selections (e.g. color), then group by size
  const sizeVariants = useMemo(() => {
    return variants.filter((v) =>
      v.selectedOptions.every((opt) => {
        if (opt.name.toLowerCase() === 'size') return true;
        return selectedOptions[opt.name] === opt.value;
      })
    );
  }, [variants, selectedOptions]);

  const hasSizes = sizeVariants.some((v) =>
    v.selectedOptions.some((o) => o.name.toLowerCase() === 'size')
  );

  const total = Object.values(quantities).reduce((s, n) => s + n, 0);
  const remaining = Math.max(0, minUnits - total);
  const isReady = total >= minUnits;

  const adjust = (variantId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[variantId] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [variantId]: next };
    });
  };

  const formatPriceDiff = (variantPrice: ProductPrice) => {
    const diff = parseFloat(variantPrice.amount) - parseFloat(basePrice.amount);
    if (diff <= 0) return null;
    return `+$${diff.toFixed(0)}`;
  };

  const getSizeLabel = (variant: ProductVariant) => {
    const sizeOpt = variant.selectedOptions.find(
      (o) => o.name.toLowerCase() === 'size'
    );
    if (sizeOpt) return sizeOpt.value;
    // No size option — use title if not the raw default, otherwise "One Size"
    if (variant.title && variant.title !== 'Default Title')
      return variant.title;
    return 'One Size';
  };

  const handleAddToCart = async () => {
    if (!isReady) return;

    const allAttributes: LineAttribute[] = [
      ...metafieldAttributes,
      ...(note?.trim() ? [{ key: 'note', value: note.trim() }] : []),
    ];

    const lines = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([merchandiseId, quantity]) => ({
        merchandiseId,
        quantity,
        ...(allAttributes.length ? { attributes: allAttributes } : {}),
      }));

    try {
      setLoading(true);
      await addItems(lines);
      openCart();
      onClose();
      setQuantities({});
    } catch (err) {
      console.error('Bulk add to cart failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              {hasSizes ? 'Bulk Order – Select Sizes' : 'Bulk Order'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors ml-4 mt-0.5"
          >
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-b border-gray-100">
          {hasSizes
            ? 'Select sizes across available variants. '
            : 'Select quantity. '}
          Minimum order is{' '}
          <span className="font-bold text-gray-900">{minUnits} units</span>.
        </p>

        {/* Size list */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {hasSizes ? 'Available Sizes' : 'Quantity'}
          </p>
          {sizeVariants.map((variant) => {
            const label = getSizeLabel(variant);
            const qty = quantities[variant.id] ?? 0;
            const priceDiff = formatPriceDiff(variant.price);

            return (
              <div
                key={variant.id}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-900">
                    {label}
                  </span>
                  {priceDiff && (
                    <span className="text-xs text-gray-400">{priceDiff}</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjust(variant.id, -1)}
                    disabled={qty === 0}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-30 transition"
                  >
                    <RiSubtractLine size={14} />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-gray-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => adjust(variant.id, 1)}
                    disabled={false}
                    className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition"
                  >
                    <RiAddLine size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total units</span>
            <span
              className={`font-semibold ${isReady ? 'text-green-600' : 'text-gray-900'}`}
            >
              {total} / {minUnits}
              {remaining > 0 && (
                <span className="text-gray-400 font-normal ml-1">
                  ({remaining} remaining)
                </span>
              )}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!isReady || loading}
            className="w-full rounded-full py-6 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader size={16} className="text-white" />
                Adding...
              </span>
            ) : isReady ? (
              'Add to Cart'
            ) : (
              `Select ${remaining} more unit${remaining !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
