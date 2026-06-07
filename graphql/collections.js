import { ProductFragment } from '@/graphql/products';

// Collection Fragment
export const CollectionFragment = `
  fragment CollectionFragment on Collection {
    id
    title
    handle
    description
    descriptionHtml
    image {
      id
      url
      altText
      width
      height
    }
  }
`;

// Get all collections
export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Get products in a collection with filtering and sorting
export const GET_COLLECTION_PRODUCTS_QUERY = `
  ${ProductFragment}
  query GetCollectionProducts(
    $handle: String!,
    $first: Int!,
    $sortKey: ProductCollectionSortKeys,
    $reverse: Boolean,
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        id
        url
        altText
        width
        height
      }
      products(first: $first, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        edges {
          node {
            ...ProductFragment
            metafields(identifiers: [
              { namespace: "custom", key: "is_enterprise" },
              { namespace: "custom", key: "enable_notes" }
            ]) {
              namespace
              key
              value
              type
            }
          }
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
