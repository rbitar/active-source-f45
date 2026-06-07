import { ProductFragment } from './products';
import { CollectionFragment } from './collections';

// Image fragment defined inline (no separate media file dependency)
export const ImageFragment = `
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;

const MetaobjectFragment = `
  fragment MetaobjectFragment on Metaobject {
    handle
    updatedAt
    fields {
      key
      value
      reference {
        ... on Product {
          ...ProductFragment
        }
        ... on Collection {
          ...CollectionFragment
        }
        ... on MediaImage {
          image {
            ...ImageFragment
          }
        }
        ... on Metaobject {
          handle
          updatedAt
          fields {
            key
            value
            reference {
              ... on Product {
                ...ProductFragment
              }
              ... on Collection {
                ...CollectionFragment
              }
              ... on MediaImage {
                image {
                  ...ImageFragment
                }
              }
              ... on Metaobject {
                handle
                id
                updatedAt
                fields {
                  key
                  value
                  reference {
                    ... on MediaImage {
                      image {
                        ...ImageFragment
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      references(first: 10) {
        edges {
          node {
            ... on Product {
              ...ProductFragment
            }
            ... on Collection {
              ...CollectionFragment
            }
            ... on MediaImage {
              image {
                ...ImageFragment
              }
            }
            ... on Metaobject {
              handle
              id
              updatedAt
              fields {
                key
                value
                reference {
                  ... on Product {
                    handle
                    title
                    images(first: 5) {
                      edges {
                        node {
                          id
                          altText
                          url
                        }
                      }
                    }
                  }
                  ... on MediaImage {
                    image {
                      ...ImageFragment
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${CollectionFragment}
  ${ProductFragment}
  ${ImageFragment}
`;

export const QUERY_METAOBJECT_BY_HANDLE = `
  ${MetaobjectFragment}
  query Metaobject($handle: String!, $type: String!) {
    metaobject(handle: { handle: $handle, type: $type }) {
      ...MetaobjectFragment
    }
  }
`;

export const QUERY_METAOBJECTS = `
  ${ImageFragment}
  ${ProductFragment}
  query Metaobjects($first: Int!, $type: String!) {
    metaobjects(first: $first, type: $type) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  ...ImageFragment
                }
              }
              ... on Product {
                ...ProductFragment
              }
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
