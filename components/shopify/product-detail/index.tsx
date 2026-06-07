'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  useProduct,
  getMetafieldValue,
  type Product,
} from '@/hooks/use-shopify-products';
import { useShopifyCart } from '@/hooks/use-shopify-cart';
import ProductDetailGallery from './product-detail-gallery';
import ProductDetailInfo from './product-detail-info';
import { Button } from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import { Loader } from '@/components/ui/loader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: {
    url: string;
    altText?: string;
  };
}

export type { Product };

interface ProductDetailProps {
  handle?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  handle: handleProp,
}) => {
  const params = useParams();
  const handle = handleProp || (params?.handle as string);
  const { addItem, openCart } = useShopifyCart();

  const { product, loading, error } = useProduct(handle);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handle]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [note, setNote] = useState('');

  // Log metafields whenever product loads
  useEffect(() => {
    if (product) {
      console.log(
        '[Product] loaded — metafields:',
        JSON.stringify(product.metafields, null, 2)
      );
    }
  }, [product]);

  // Initialize variant when product loads
  useEffect(() => {
    if (product) {
      const firstVariant = product.variants.edges[0]?.node;
      if (firstVariant) {
        setSelectedVariant(firstVariant);

        const initialOptions: Record<string, string> = {};
        firstVariant.selectedOptions.forEach(
          (option: { name: string; value: string }) => {
            initialOptions[option.name] = option.value;
          }
        );
        setSelectedOptions(initialOptions);
      }
    }
  }, [product]);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const matchingVariant = product?.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(
        (option) => newOptions[option.name] === option.value
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);

      // Update image if variant has an associated image
      if (matchingVariant.node.image && product) {
        const variantImageUrl = matchingVariant.node.image.url;
        const imageIndex = product.images.edges.findIndex(
          (edge) => edge.node.url === variantImageUrl
        );
        if (imageIndex !== -1) {
          setSelectedImageIndex(imageIndex);
        }
      }
    }
  };

  const buildMetafieldAttributes = () => {
    console.log(
      '[Product] raw metafields from Shopify:',
      JSON.stringify(product?.metafields, null, 2)
    );
    if (!product?.metafields) {
      console.warn(
        '[Product] metafields is undefined — query may not have returned them'
      );
      return [];
    }
    const keys = [
      'front_dimensions',
      'front_note',
      'back_dimensions',
      'back_note',
      'cost',
    ];
    const attrs = keys
      .map((key) => ({
        key: `_${key}`,
        value: getMetafieldValue(product.metafields, key),
      }))
      .filter(
        (attr): attr is { key: string; value: string } => attr.value !== null
      );

    // Append customer note if provided
    if (note.trim()) {
      attrs.push({ key: 'note', value: note.trim() });
    }

    console.log(
      '[Product] metafield attributes being attached to cart line:',
      JSON.stringify(attrs, null, 2)
    );
    return attrs;
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;

    try {
      setAddingToCart(true);
      const attributes = buildMetafieldAttributes();
      await addItem(
        selectedVariant.id,
        quantity,
        attributes.length ? attributes : undefined
      );
      openCart();
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={20} className="text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <ErrorMessage
        title="Product unavailable"
        subtitle="This product could not be loaded. It may have moved or been removed."
        action={{ label: 'Back to home', href: '/' }}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductDetailGallery
            images={product.images.edges.map((edge) => edge.node)}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={setSelectedImageIndex}
          />
          <ProductDetailInfo
            product={product}
            selectedVariant={selectedVariant}
            selectedOptions={selectedOptions}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            onOptionChange={handleOptionChange}
            loading={addingToCart}
            note={note}
            setNote={setNote}
          />
        </div>
      </div>

      {/* Description & Shipping Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="description">
          <div className="flex justify-center border-b border-gray-200 mb-8">
            <TabsList className="bg-transparent rounded-none h-auto p-0 gap-10">
              <TabsTrigger
                value="description"
                className="bg-transparent rounded-none border-0 border-b-2 border-transparent -mb-px pb-3 pt-0 px-0 text-base font-semibold text-gray-500 data-[state=active]:text-black data-[state=active]:border-black data-[state=active]:shadow-none"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="bg-transparent rounded-none border-0 border-b-2 border-transparent -mb-px pb-3 pt-0 px-0 text-base font-semibold text-gray-500 data-[state=active]:text-black data-[state=active]:border-black data-[state=active]:shadow-none"
              >
                Shipping
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="description"
            className="max-w-3xl mx-auto text-gray-700 leading-relaxed"
          >
            {product.descriptionHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p>{product.description}</p>
            )}
          </TabsContent>

          <TabsContent
            value="shipping"
            className="max-w-3xl mx-auto text-gray-700 leading-relaxed"
          >
            <p className="mb-4">
              All orders undergo manufacturing and processing within 12-14
              business days (Monday–Friday). Please note that orders are not
              manufactured or shipped on weekends or holidays.
            </p>
            <p>
              For more detailed information, please visit our{' '}
              <a
                href="https://www.activesourcelab.com/pages/shipping"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black transition-colors"
              >
                Shipping page
              </a>
              .
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
