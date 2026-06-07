'use client';

import React from 'react';
import Link from 'next/link';
import { featuredCollections } from '@/lib/shop';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  AnimatePresence,
} from '@/components/ui/sheet';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ShopByCollectionSheet({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Sheet open={open} onOpenChange={onClose} side="left">
          <SheetContent
            showCloseButton={false}
            className="w-[280px] sm:max-w-[280px]"
          >
            <SheetHeader className="pb-2">
              <SheetTitle className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                Shop
              </SheetTitle>
            </SheetHeader>
            <SheetBody className="px-0 py-0">
              <div className="flex flex-col">
                {featuredCollections.map(({ label, handle }) => (
                  <Link
                    key={handle}
                    href={`/shop/collections/${handle}`}
                    onClick={onClose}
                    className="text-[15px] text-gray-700 hover:text-black hover:bg-gray-50 px-6 py-3"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </SheetBody>
          </SheetContent>
        </Sheet>
      )}
    </AnimatePresence>
  );
}
