'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CarouselContextType {
  currentIndex: number;
  itemCount: number;
  visibleCount: number;
  setItemCount: (n: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: 'horizontal' | 'vertical';
}

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context)
    throw new Error('Carousel components must be used within a Carousel');
  return context;
}

interface CarouselProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  /** How many items are visible at once (used for page scrolling) */
  visibleCount?: number;
}

function Carousel({
  children,
  orientation = 'horizontal',
  className,
  autoPlay = false,
  autoPlayInterval = 3000,
  visibleCount = 4,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const maxIndex = Math.max(0, itemCount - visibleCount);
  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < maxIndex;

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - visibleCount));
  }, [visibleCount]);

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + visibleCount));
  }, [maxIndex, visibleCount]);

  useEffect(() => {
    if (!autoPlay) return;
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + visibleCount));
    }, autoPlayInterval);
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [autoPlay, autoPlayInterval, maxIndex, visibleCount]);

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        itemCount,
        visibleCount,
        setItemCount,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
      }}
    >
      <div
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

interface CarouselContentProps {
  className?: string;
  children: React.ReactNode;
}

function CarouselContent({ className, children }: CarouselContentProps) {
  const { currentIndex, visibleCount, setItemCount, orientation } =
    useCarousel();

  const items = React.Children.toArray(children);
  const count = items.length;

  // Report item count up to Carousel context
  useEffect(() => {
    setItemCount(count);
  }, [count, setItemCount]);

  const itemWidthPct = 100 / visibleCount;
  const translatePct = currentIndex * itemWidthPct;

  return (
    <div
      className={cn('overflow-hidden', className)}
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        )}
        style={{
          transform:
            orientation === 'horizontal'
              ? `translateX(-${translatePct}%)`
              : `translateY(-${translatePct}%)`,
          transition: 'transform 300ms ease-out',
        }}
      >
        {items.map((child, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width: `${itemWidthPct}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

interface CarouselItemProps {
  className?: string;
  children: React.ReactNode;
}

function CarouselItem({ className, children }: CarouselItemProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn('w-full', className)}
    >
      {children}
    </div>
  );
}

interface CarouselPreviousProps {
  className?: string;
}

function CarouselPrevious({ className }: CarouselPreviousProps) {
  const { scrollPrev, canScrollPrev, orientation } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant="outline"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      style={{ backgroundColor: 'white' }}
      className={cn(
        'size-10 rounded-full p-0 flex items-center justify-center shrink-0',
        className
      )}
      aria-label="Previous slide"
    >
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
    </Button>
  );
}

interface CarouselNextProps {
  className?: string;
}

function CarouselNext({ className }: CarouselNextProps) {
  const { scrollNext, canScrollNext, orientation } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant="outline"
      onClick={scrollNext}
      disabled={!canScrollNext}
      style={{ backgroundColor: 'white' }}
      className={cn(
        'size-10 rounded-full p-0 flex items-center justify-center shrink-0',
        className
      )}
      aria-label="Next slide"
    >
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
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
