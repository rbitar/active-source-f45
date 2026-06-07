'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import ProductCard from '@/components/shopify/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel';
import { useCollectionProducts } from '@/hooks/use-shopify-collections';
import type { Product } from '@/hooks/use-shopify-products';
import { Button } from '@/components/ui/button';

const VISIBLE_COUNT_DESKTOP = 4;
const VISIBLE_COUNT_MOBILE = 1;

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function MobileCarouselInner({ items }: { items: React.ReactNode }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        style={{ backgroundColor: 'white' }}
        className="shrink-0 size-10 rounded-full p-0 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </Button>
      <div className="flex-1 min-w-0 overflow-hidden">
        <CarouselContent>{items}</CarouselContent>
      </div>
      <Button
        variant="outline"
        onClick={scrollNext}
        disabled={!canScrollNext}
        style={{ backgroundColor: 'white' }}
        className="shrink-0 size-10 rounded-full p-0 flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

function DesktopCarouselInner({ items }: { items: React.ReactNode }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  return (
    <div className="relative px-16">
      <CarouselContent>{items}</CarouselContent>
      <Button
        variant="outline"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        style={{ backgroundColor: 'white' }}
        className="absolute top-1/2 -translate-y-1/2 left-4 size-10 rounded-full p-0 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        onClick={scrollNext}
        disabled={!canScrollNext}
        style={{ backgroundColor: 'white' }}
        className="absolute top-1/2 -translate-y-1/2 right-4 size-10 rounded-full p-0 flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export interface CollectionCarouselProps {
  collectionHandle: string | { label: string; value: string };
  label?: string;
  title: string;
  description?: string;
  showViewAll?: boolean;
  itemsPerPage?: number;
  className?: string;
  [key: string]: any;
}

export default function CollectionCarousel({
  collectionHandle,
  label,
  title,
  description,
  showViewAll = true,
  itemsPerPage = 20,
  className,
  ...rest
}: CollectionCarouselProps) {
  const handle =
    typeof collectionHandle === 'string'
      ? collectionHandle
      : collectionHandle?.value || '';

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { collection, loading, error } = useCollectionProducts(handle, {
    first: Math.max(itemsPerPage, 20),
  });

  const products = collection?.products || [];

  const isEditing = Object.keys(rest).some(
    (k) => k.startsWith('data-rte') || k.startsWith('data-puck')
  );

  if (!handle) {
    return (
      <div {...rest} className={cn('w-full py-12', className)}>
        <div className="text-center text-muted-foreground">
          <p>Please select a collection</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div {...rest} className={cn('w-full py-12', className)}>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            Collection unavailable
          </p>
          <p className="text-sm text-muted-foreground">
            This collection could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const productItems = products.map((product: Product) => (
    <CarouselItem key={product.id} className="px-2">
      <ProductCard product={product} />
    </CarouselItem>
  ));

  return (
    <div {...rest} className={cn('w-full py-8 md:py-12 relative', className)}>
      {isEditing && <div className="absolute inset-0 z-10" />}

      <div className="px-4 md:px-6 mb-6 md:mb-8">
        {label && (
          <p className="text-sm md:text-base font-medium text-muted-foreground mb-2 uppercase tracking-widest">
            {label}
          </p>
        )}
        <div className="flex items-center gap-4 mb-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
          {showViewAll && (
            <Link
              href={`/shop/collections/${handle}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              Shop All →
            </Link>
          )}
        </div>
        {description && (
          <p className="text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={20} className="text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No products available in this collection.</p>
        </div>
      ) : (
        <>
          <div className="md:hidden px-4">
            <Carousel visibleCount={VISIBLE_COUNT_MOBILE}>
              <MobileCarouselInner items={productItems} />
            </Carousel>
          </div>
          <div className="hidden md:block">
            <Carousel visibleCount={VISIBLE_COUNT_DESKTOP}>
              <DesktopCarouselInner items={productItems} />
            </Carousel>
          </div>
        </>
      )}
    </div>
  );
}
