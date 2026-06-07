'use client';

import React from 'react';
import { useProductRecommendations } from '@/hooks/use-shopify-products';
import ProductCard from '../product-card';

interface ProductRecommendationsProps {
  productId: string;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ productId }) => {
  const { recommendations, loading, error } = useProductRecommendations(productId);

  // Don't show section if we're not loading and have no recommendations
  if (!loading && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 font-heading">
          You Might Also Like
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Recommendations could not be loaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recommendations.slice(0, 4).map((recommendedProduct) => (
              <ProductCard
                key={recommendedProduct.id}
                product={recommendedProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRecommendations;
