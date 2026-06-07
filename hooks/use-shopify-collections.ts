'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopifyFetch } from '@/services/shopify/client';
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
} from '@/graphql/collections';
import type { Product } from '@/hooks/use-shopify-products';

interface CollectionImage {
  url: string;
  altText?: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: CollectionImage;
}

export interface CollectionWithProducts extends Collection {
  products: Product[];
  totalCount: number;
}

export type SortKey =
  | 'BEST_SELLING'
  | 'CREATED'
  | 'PRICE'
  | 'TITLE'
  | 'COLLECTION_DEFAULT'
  | 'ID'
  | 'MANUAL'
  | 'RELEVANCE';

export interface CollectionFilters {
  productType?: string[];
}

export interface UseCollectionProductsOptions {
  first?: number;
  sortKey?: SortKey;
  reverse?: boolean;
  filters?: CollectionFilters;
}

// Fetch all collections
export async function getCollections(first = 50): Promise<Collection[]> {
  const response = await shopifyFetch({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
  });

  return response.data.collections.edges.map(
    (edge: { node: Collection }) => edge.node
  );
}

// Build Shopify ProductFilter array from our filters
function buildShopifyFilters(filters?: CollectionFilters) {
  const result: Record<string, string>[] = [];
  if (filters?.productType?.length) {
    filters.productType.forEach((pt) => {
      result.push({ productType: pt });
    });
  }
  return result.length > 0 ? result : undefined;
}

// Fetch products in a collection by handle
export async function getCollectionProducts(
  handle: string,
  {
    first = 50,
    sortKey = 'BEST_SELLING',
    reverse = false,
    filters,
  }: UseCollectionProductsOptions = {}
): Promise<CollectionWithProducts | null> {
  const shopifyFilters = buildShopifyFilters(filters);

  const response = await shopifyFetch({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: {
      handle,
      first,
      sortKey,
      reverse,
      ...(shopifyFilters ? { filters: shopifyFilters } : {}),
    },
  });

  const collection = response.data.collection;
  if (!collection) return null;

  const products = collection.products.edges.map(
    (edge: { node: Product }) => edge.node
  );

  console.log(
    `[useCollectionProducts] handle="${handle}" — fetched ${products.length} product(s)`
  );
  products.forEach((p) => {
    const isEnterprise = (p.metafields ?? []).find(
      (m: any) => m?.key === 'is_enterprise'
    );
    console.log(
      `[useCollectionProducts] product "${p.handle}" metafields:`,
      JSON.stringify(p.metafields ?? []),
      '| is_enterprise value:',
      isEnterprise?.value ?? '(not set / null)'
    );
  });

  return {
    ...collection,
    products,
    totalCount: products.length,
  };
}

// Hook for fetching all collections
export function useCollections(first = 50) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCollections(first);
      setCollections(data);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load collections'
      );
    } finally {
      setLoading(false);
    }
  }, [first]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { collections, loading, error, refetch: fetchCollections };
}

// Hook for fetching products in a collection
export function useCollectionProducts(
  handle: string | null,
  options: UseCollectionProductsOptions = {}
) {
  const [collection, setCollection] = useState<CollectionWithProducts | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { first, sortKey, reverse, filters } = options;
  const filtersKey = JSON.stringify(filters);

  const fetchCollection = useCallback(async () => {
    if (!handle) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCollectionProducts(handle, {
        first,
        sortKey,
        reverse,
        filters,
      });
      setCollection(data);
      if (!data) {
        setError('Collection not found');
      }
    } catch (err) {
      console.error('Error fetching collection products:', err);
      setError('Failed to load collection');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, first, sortKey, reverse, filtersKey]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { collection, loading, error, refetch: fetchCollection };
}
