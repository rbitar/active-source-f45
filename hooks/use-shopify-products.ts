'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopifyFetch } from '@/services/shopify/client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  QUERY_PRODUCT_RECOMMENDATIONS,
} from '@/graphql/products';

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
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ProductImage;
}

export interface ProductOptionValueSwatch {
  color?: string | null;
  image?: {
    previewImage?: {
      url: string;
      altText?: string;
    } | null;
  } | null;
}

export interface ProductOptionValue {
  id: string;
  name: string;
  swatch?: ProductOptionValueSwatch | null;
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
  optionValues?: ProductOptionValue[];
}

export interface ProductMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  handle: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  options: ProductOption[];
  // Custom metafields array (only present on single-product queries)
  metafields?: (ProductMetafield | null)[];
}

// Helper: find a metafield value by key from the metafields array
export function getMetafieldValue(
  metafields: (ProductMetafield | null)[] | undefined,
  key: string
): string | null {
  if (!metafields) return null;
  return metafields.find((m) => m?.key === key)?.value ?? null;
}

interface UseProductsOptions {
  first?: number;
  query?: string;
  sortKey?: 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'TITLE';
  reverse?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Fetch multiple products
export async function getProducts({
  first = 20,
  query = '',
  sortKey = 'BEST_SELLING',
  reverse = false,
}: UseProductsOptions = {}): Promise<Product[]> {
  const response = await shopifyFetch({
    query: GET_PRODUCTS_QUERY,
    variables: { first, query, sortKey, reverse },
  });

  return response.data.products.edges.map(
    (edge: { node: Product }) => edge.node
  );
}

// Fetch a single product by handle
export async function getProduct(handle: string): Promise<Product | null> {
  const response = await shopifyFetch({
    query: GET_PRODUCT_QUERY,
    variables: { handle },
  });

  const product: Product | null = response.data.product;

  if (product) {
    const isEnterprise = (product.metafields ?? []).find(
      (m) => m?.key === 'is_enterprise'
    );
    console.log(
      `[getProduct] handle="${handle}" — metafields:`,
      JSON.stringify(product.metafields ?? [])
    );
    console.log(
      `[getProduct] handle="${handle}" — is_enterprise value:`,
      isEnterprise?.value ?? '(not set / null)'
    );
  } else {
    console.warn(`[getProduct] handle="${handle}" — product not found`);
  }

  return product;
}

// Fetch product recommendations
export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  const response = await shopifyFetch({
    query: QUERY_PRODUCT_RECOMMENDATIONS,
    variables: { productId },
  });

  return response.data.productRecommendations || [];
}

// Hook for fetching multiple products
export function useProducts(
  options: UseProductsOptions = {}
): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(options);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [options.first, options.query, options.sortKey, options.reverse]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

// Hook for fetching a single product
export function useProduct(handle: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!handle) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProduct(handle);
      setProduct(data);
      if (!data) {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}

// Hook for fetching product recommendations
export function useProductRecommendations(productId: string | null) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProductRecommendations(productId);
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load recommendations'
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, error, refetch: fetchRecommendations };
}
