# Active Source F45

A modern e-commerce storefront built with Next.js, Tailwind CSS, and Shopify Storefront API.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **E-commerce:** Shopify Storefront API
- **Language:** TypeScript

## Features

- Browse products and collections
- Product detail pages with gallery
- Shopping cart drawer
- Collection filtering
- Bulk order support
- Enterprise enquiry dialog

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/rbitar/active-source-f45.git
   cd active-source-f45
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI and Shopify components
├── graphql/              # GraphQL queries
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # External API clients
└── contexts/             # React context providers
```
