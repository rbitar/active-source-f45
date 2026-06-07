'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useCollectionProducts } from '@/hooks/use-shopify-collections';
import type { Product } from '@/hooks/use-shopify-products';
import ProductCard from './product-card';
import ShopFilterSheet from './shop-filter-sheet';
import ErrorMessage from '@/components/ui/error-message';
import { Loader } from '@/components/ui/loader';
import {
  RiEqualizerLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from '@remixicon/react';

const ITEMS_PER_PAGE = 12;

// Build page number array with ellipsis markers
function buildPageRange(
  current: number,
  total: number,
  radius: number
): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const left = Math.max(2, current - radius);
  const right = Math.min(total - 1, current + radius);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  if (total > 1) pages.push(total);

  return pages;
}

function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  // radius = 1 on mobile (xs), 2 on sm+
  const mobilePages = buildPageRange(page, totalPages, 1);
  const desktopPages = buildPageRange(page, totalPages, 2);

  const btnBase =
    'inline-flex items-center justify-center min-w-[2rem] h-8 px-2 text-sm border rounded transition-colors';
  const btnActive = 'bg-black text-white border-black font-semibold';
  const btnDefault = 'border-gray-300 hover:border-black text-gray-700';
  const btnDisabled = 'border-gray-200 text-gray-300 cursor-not-allowed';

  const renderPages = (pages: (number | '...')[]) =>
    pages.map((p, idx) =>
      p === '...' ? (
        <span
          key={`ellipsis-${idx}`}
          className="inline-flex items-center justify-center min-w-[2rem] h-8 text-sm text-gray-400"
        >
          …
        </span>
      ) : (
        <button
          key={p}
          onClick={() => onPageChange(p as number)}
          className={`${btnBase} ${p === page ? btnActive : btnDefault}`}
        >
          {p}
        </button>
      )
    );

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* Prev */}
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`${btnBase} gap-0.5 px-2 ${page === 1 ? btnDisabled : btnDefault}`}
      >
        <RiArrowLeftSLine size={16} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Mobile pages (radius=1) */}
      <span className="flex items-center gap-1 sm:hidden">
        {renderPages(mobilePages)}
      </span>

      {/* Desktop pages (radius=2) */}
      <span className="hidden sm:flex items-center gap-1">
        {renderPages(desktopPages)}
      </span>

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`${btnBase} gap-0.5 px-2 ${page === totalPages ? btnDisabled : btnDefault}`}
      >
        <span className="hidden sm:inline">Next</span>
        <RiArrowRightSLine size={16} />
      </button>
    </div>
  );
}

function sortProducts(products: Product[], sortKey: string): Product[] {
  const sorted = [...products];
  switch (sortKey) {
    case 'price_asc':
      return sorted.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
      );
    case 'price_desc':
      return sorted.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
      );
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

const CollectionDetail: React.FC = () => {
  const params = useParams();
  const handle = params?.handle as string;

  const [sortKey, setSortKey] = useState('best_selling');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { collection, loading, error, refetch } = useCollectionProducts(
    handle,
    { first: 250 }
  );

  const formattedTitle = handle
    ? handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Collection';

  const title = collection?.title || formattedTitle;

  const filteredProducts = useMemo(() => {
    let products = collection?.products ?? [];
    if (selectedTypes.length > 0) {
      products = products.filter((p) =>
        selectedTypes.some(
          (t) => p.productType?.toLowerCase() === t.toLowerCase()
        )
      );
    }
    return sortProducts(products, sortKey);
  }, [collection?.products, selectedTypes, sortKey]);

  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleApplyFilters = (newSortKey: string, newTypes: string[]) => {
    setSortKey(newSortKey);
    setSelectedTypes(newTypes);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={20} className="text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Collection unavailable"
        subtitle="This collection could not be loaded. It may have moved or been removed."
        action={{ label: 'Try again', onClick: () => refetch() }}
      />
    );
  }

  return (
    <div className="py-8">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {totalCount > 0 && (
            <span className="hidden sm:inline text-sm text-gray-500">
              Showing: {totalCount} result{totalCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-gray-700 hover:text-black border border-gray-300 hover:border-black px-4 py-2 rounded"
        >
          Sort &amp; Filter
          <RiEqualizerLine size={16} />
        </button>
      </div>

      {/* Products grid */}
      {/* Debug: log enterprise metafield state for each product in this page */}
      {
        paginatedProducts.forEach((p) => {
          const mf = (p.metafields ?? []).find(
            (m: any) => m?.key === 'is_enterprise'
          );
          console.log(
            `[CollectionDetail] render — product "${p.handle}" | is_enterprise:`,
            mf?.value ?? '(absent)'
          );
        }) as unknown as null
      }

      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Sort & Filter Sheet */}
      <ShopFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        sortKey={sortKey}
        selectedTypes={selectedTypes}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default CollectionDetail;
