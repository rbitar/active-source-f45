'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CollectionDetail from '@/components/shopify/collection-detail';
import { useCollectionProducts } from '@/hooks/use-shopify-collections';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CollectionPage() {
  const params = useParams();
  const handle = params?.handle as string;

  const { collection } = useCollectionProducts(handle, { first: 1 });

  const title =
    collection?.title ??
    (handle
      ? handle.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Collection');

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
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CollectionDetail />
      </div>
    </div>
  );
}
