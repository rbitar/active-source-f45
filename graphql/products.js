// Product Fragment for consistent product data
export const ProductFragment = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      id
      name
      values
      optionValues {
        id
        name
        swatch {
          color
          image {
            previewImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

// Get multiple products
export const GET_PRODUCTS_QUERY = `
  ${ProductFragment}
  query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Get a single product by handle (with custom metafields)
export const GET_PRODUCT_QUERY = `
  ${ProductFragment}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
      metafields(identifiers: [
        { namespace: "custom", key: "front_dimensions" },
        { namespace: "custom", key: "front_note" },
        { namespace: "custom", key: "back_dimensions" },
        { namespace: "custom", key: "back_note" },
        { namespace: "custom", key: "cost" },
        { namespace: "custom", key: "is_enterprise" },
        { namespace: "custom", key: "enable_notes" },
        { namespace: "custom", key: "moq" },
        { namespace: "custom", key: "technique" },
        { namespace: "custom", key: "min_quantity" },
        { namespace: "custom", key: "enterprise_product_description" }
      ]) {
        namespace
        key
        value
        type
      }
    }
  }
`;

// Get product recommendations
export const QUERY_PRODUCT_RECOMMENDATIONS = `
  ${ProductFragment}
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFragment
    }
  }
`;
