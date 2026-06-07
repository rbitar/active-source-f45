'use client';

import React from 'react';
import './globals.css';
import { ShopifyProvider } from '@/contexts/shopify-context';
import ShopifyCart from '@/components/shopify/cart-drawer';
import ShopHeader from '@/components/shopify/shop-header';
import ShopFooter from '@/components/shopify/shop-footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="m-0 p-0 font-body bg-background">
        <ShopifyProvider>
          <ShopHeader />
          <main className="min-h-screen">{children}</main>
          <ShopFooter />
          <ShopifyCart />
        </ShopifyProvider>
      </body>
    </html>
  );
}
