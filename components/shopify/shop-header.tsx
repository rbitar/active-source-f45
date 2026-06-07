'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useShopifyCart } from '@/hooks/use-shopify-cart';
import { usePathname } from 'next/navigation';
import { headerNavLinks, featuredCollections } from '@/lib/shop';
import ShopByCollectionSheet from './shop-by-collection-sheet';
import {
  Sheet,
  SheetContent,
  SheetBody,
  AnimatePresence,
} from '@/components/ui/sheet';
import { RiArrowRightSLine, RiShoppingCartLine } from '@remixicon/react';

const CartIcon: React.FC = () => {
  const { toggleCart, itemCount } = useShopifyCart();
  return (
    <button
      onClick={toggleCart}
      className="relative p-1 text-[#2e2e2e] hover:text-black transition-colors"
    >
      <RiShoppingCartLine size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

const Header: React.FC = () => {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);

  const SHOP_HREF = '/shop/collections';

  return (
    <>
      <nav className="bg-background sticky top-0 z-30 h-[67px]">
        <div className="px-4 md:px-12 h-full flex items-center justify-between">
          {/* Desktop left nav */}
          <div className="hidden lg:flex items-center gap-6 text-[16px] text-[#2e2e2e] font-normal">
            {headerNavLinks.map(({ href, label }) => {
              const isShopByCollection = href === SHOP_HREF;
              const isActive = isShopByCollection
                ? sheetOpen
                : pathname === href;

              if (isShopByCollection) {
                return (
                  <button
                    key={href}
                    onClick={() => setSheetOpen((v) => !v)}
                    className={`hover:text-black transition-colors whitespace-nowrap pb-0.5 border-b-2 ${
                      isActive
                        ? 'text-black border-black'
                        : 'border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSheetOpen(false)}
                  className={`hover:text-black transition-colors whitespace-nowrap pb-0.5 border-b-2 ${
                    isActive ? 'text-black border-black' : 'border-transparent'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile: hamburger */}
          <button
            className="lg:hidden p-1 text-[#2e2e2e] hover:text-black"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Center logos */}
          <Link
            href="/"
            onClick={() => {
              setSheetOpen(false);
              setMobileOpen(false);
            }}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
          >
            <Image
              src="https://supabase.frontend.co/storage/v1/object/public/apps/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/f45-logo.png"
              alt="F45 Training"
              width={72}
              height={32}
              className="object-contain"
              priority
            />
            <div className="hidden sm:flex flex-col items-start gap-0.5">
              <span className="text-[9px] text-[#b4b4b4] uppercase tracking-widest leading-none">
                Powered by
              </span>
              <Image
                src="https://supabase.frontend.co/storage/v1/object/public/apps/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/logo.svg"
                alt="Active Source Lab"
                width={120}
                height={24}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right: cart */}
          <div className="flex items-center">
            <CartIcon />
          </div>
        </div>
      </nav>

      {/* Desktop: Shop by Collection sheet */}
      <ShopByCollectionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen} side="left">
            <SheetContent
              showCloseButton={false}
              className="w-[280px] sm:max-w-[280px] p-0"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between px-6 h-[67px] border-b border-border">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Go to homepage"
                >
                  <Image
                    src="https://supabase.frontend.co/storage/v1/object/public/apps/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/f45-logo.png"
                    alt="F45 Training"
                    width={56}
                    height={24}
                    className="object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-gray-500 hover:text-black"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <SheetBody className="px-0 py-0">
                <div className="flex flex-col">
                  {headerNavLinks.map(({ href, label }) => {
                    const isShopByCollection = href === SHOP_HREF;

                    if (isShopByCollection) {
                      return (
                        <div key={href}>
                          <button
                            onClick={() => setCollectionsExpanded((v) => !v)}
                            className="w-full flex items-center justify-between text-[15px] text-gray-700 hover:text-black hover:bg-gray-50 px-6 py-3.5 border-b border-border"
                          >
                            <span>{label}</span>
                            <RiArrowRightSLine
                              size={18}
                              className={`text-gray-400 transition-transform duration-200 ${
                                collectionsExpanded ? 'rotate-90' : 'rotate-0'
                              }`}
                            />
                          </button>
                          {collectionsExpanded && (
                            <div className="bg-gray-50 border-b border-border">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-8 pt-3 pb-1">
                                Collections
                              </p>
                              {featuredCollections.map(
                                ({ label: colLabel, handle }) => (
                                  <Link
                                    key={handle}
                                    href={`/shop/collections/${handle}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-[14px] text-gray-600 hover:text-black px-8 py-2.5"
                                  >
                                    {colLabel}
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="text-[15px] text-gray-700 hover:text-black hover:bg-gray-50 px-6 py-3.5 border-b border-border"
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </SheetBody>
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
