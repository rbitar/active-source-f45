'use client';

import React, { useState } from 'react';
import { RiArrowRightSLine } from '@remixicon/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  AnimatePresence,
} from '@/components/ui/sheet';

export const SORT_OPTIONS = [
  { label: 'Most Popular', key: 'best_selling' },
  { label: "What's New", key: 'newest' },
  { label: 'Price: High to Low', key: 'price_desc' },
  { label: 'Price: Low to High', key: 'price_asc' },
];

export const PRODUCT_TYPES = [
  'Bag',
  'Hoodie',
  'Jogger Pants',
  'Pants',
  'Polo',
  'Shirt',
  'Tank',
  "Women's Hoodie",
  "Women's Pants",
  "Women's Shirt",
  "Women's Tank",
  'Zip Shirt',
];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
      >
        <span>{title}</span>
        <RiArrowRightSLine
          size={18}
          className={`text-gray-500 transition-transform duration-200 ${
            open ? 'rotate-90' : 'rotate-0'
          }`}
        />
      </button>
      {open && <div className="px-6 pb-5">{children}</div>}
    </div>
  );
}

interface ShopFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortKey: string;
  selectedTypes: string[];
  onApply: (sortKey: string, types: string[]) => void;
}

export default function ShopFilterSheet({
  open,
  onOpenChange,
  sortKey,
  selectedTypes,
  onApply,
}: ShopFilterSheetProps) {
  const [pendingSortKey, setPendingSortKey] = useState(sortKey);
  const [pendingTypes, setPendingTypes] = useState<string[]>(selectedTypes);

  // Sync pending state when sheet opens
  React.useEffect(() => {
    if (open) {
      setPendingSortKey(sortKey);
      setPendingTypes([...selectedTypes]);
    }
  }, [open, sortKey, selectedTypes]);

  const toggleType = (type: string) => {
    setPendingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClear = () => {
    setPendingSortKey('best_selling');
    setPendingTypes([]);
  };

  const handleApply = () => {
    onApply(pendingSortKey, pendingTypes);
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <Sheet open={open} onOpenChange={onOpenChange} side="right">
          <SheetContent
            className="w-[320px] sm:max-w-[320px] flex flex-col h-full"
            showCloseButton={false}
          >
            <SheetHeader className="flex flex-row items-center justify-between">
              <SheetTitle className="text-base font-semibold">
                Sort &amp; Filter
              </SheetTitle>
              <button
                onClick={() => onOpenChange(false)}
                className="text-gray-500 hover:text-black text-lg leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </SheetHeader>

            <SheetBody className="flex-1 overflow-y-auto px-0 py-0">
              {/* Sort by */}
              <CollapsibleSection title="Sort by">
                <div className="space-y-3 pt-1">
                  {SORT_OPTIONS.map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sort"
                        checked={pendingSortKey === opt.key}
                        onChange={() => setPendingSortKey(opt.key)}
                        className="w-4 h-4 accent-black"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Product Type — hidden for now */}
            </SheetBody>

            {/* Footer actions */}
            <div className="grid grid-cols-2 border-t border-border">
              <button
                onClick={handleClear}
                className="py-4 text-xs font-bold tracking-widest uppercase text-gray-700 hover:bg-gray-100 border-r border-border"
              >
                Clear Selection
              </button>
              <button
                onClick={handleApply}
                className="py-4 text-xs font-bold tracking-widest uppercase bg-black text-white hover:bg-gray-900"
              >
                Apply
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </AnimatePresence>
  );
}
