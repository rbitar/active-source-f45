'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  createCart,
  getCart,
  addCartLines,
  removeCartLines,
  updateCartLines,
  type CartLineAttribute,
} from '@/hooks/use-shopify-cart';

const CART_ID_KEY = 'cartId';

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions?: Array<{
      name: string;
      value: string;
    }>;
    product: {
      title: string;
      handle?: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText: string | null;
          };
        }>;
      };
    };
  };
}

interface ShopifyCart {
  id: string;
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount?: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
  checkoutUrl: string;
}

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartId: string | null;
  cart: ShopifyCart | null;
  items: CartLine[];
  itemCount: number;
  totalAmount: number;
  checkoutUrl: string | null;
  loading: boolean;
  error: string | null;
  addItem: (
    variantId: string,
    quantity?: number,
    attributes?: CartLineAttribute[]
  ) => Promise<ShopifyCart>;
  addItems: (
    lines: {
      merchandiseId: string;
      quantity: number;
      attributes?: CartLineAttribute[];
    }[]
  ) => Promise<ShopifyCart>;
  removeItem: (lineId: string) => Promise<ShopifyCart>;
  updateItemQuantity: (
    lineId: string,
    quantity: number
  ) => Promise<ShopifyCart>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const ShopifyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storeCartId = useCallback((id: string) => {
    localStorage.setItem(CART_ID_KEY, id);
    setCartId(id);
  }, []);

  const refreshCart = useCallback(async () => {
    const storedCartId = localStorage.getItem(CART_ID_KEY);
    if (!storedCartId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedCart = await getCart(storedCartId);
      if (fetchedCart) {
        setCart(fetchedCart);
        setCartId(storedCartId);
      } else {
        localStorage.removeItem(CART_ID_KEY);
        setCartId(null);
        setCart(null);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      localStorage.removeItem(CART_ID_KEY);
      setCartId(null);
      setCart(null);
      setError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const getOrCreateCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;

    const storedCartId = localStorage.getItem(CART_ID_KEY);
    if (storedCartId) {
      setCartId(storedCartId);
      return storedCartId;
    }

    try {
      const newCart = await createCart();
      setCart(newCart);
      storeCartId(newCart.id);
      return newCart.id;
    } catch (err) {
      console.error('Failed to create cart:', err);
      throw err;
    }
  }, [cartId, storeCartId]);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const addItem = useCallback(
    async (
      variantId: string,
      quantity: number = 1,
      attributes?: CartLineAttribute[]
    ): Promise<ShopifyCart> => {
      try {
        setLoading(true);
        setError(null);

        const currentCartId = await getOrCreateCart();
        const lines = [
          {
            merchandiseId: variantId,
            quantity,
            ...(attributes ? { attributes } : {}),
          },
        ];
        console.log(
          '[Cart] addItem → lines being sent to Shopify:',
          JSON.stringify(lines, null, 2)
        );
        const updatedCart = await addCartLines(currentCartId, lines);

        setCart(updatedCart);
        return updatedCart;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add item to cart';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getOrCreateCart]
  );

  const addItems = useCallback(
    async (
      lines: {
        merchandiseId: string;
        quantity: number;
        attributes?: CartLineAttribute[];
      }[]
    ): Promise<ShopifyCart> => {
      try {
        setLoading(true);
        setError(null);

        const currentCartId = await getOrCreateCart();
        console.log(
          '[Cart] addItems → lines being sent to Shopify:',
          JSON.stringify(lines, null, 2)
        );
        const updatedCart = await addCartLines(currentCartId, lines);

        setCart(updatedCart);
        return updatedCart;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to add items to cart';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getOrCreateCart]
  );

  const removeItem = useCallback(
    async (lineId: string): Promise<ShopifyCart> => {
      if (!cartId) {
        throw new Error('No cart exists');
      }

      try {
        setLoading(true);
        setError(null);

        const updatedCart = await removeCartLines(cartId, [lineId]);
        setCart(updatedCart);
        return updatedCart;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to remove item from cart';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cartId]
  );

  const updateItemQuantity = useCallback(
    async (lineId: string, quantity: number): Promise<ShopifyCart> => {
      if (!cartId) {
        throw new Error('No cart exists');
      }

      if (quantity <= 0) {
        return removeItem(lineId);
      }

      try {
        setLoading(true);
        setError(null);

        const updatedCart = await updateCartLines(cartId, [
          { id: lineId, quantity },
        ]);
        setCart(updatedCart);
        return updatedCart;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update item quantity';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cartId, removeItem]
  );

  const items = cart?.lines?.edges?.map((edge) => edge.node) ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = parseFloat(cart?.cost?.totalAmount?.amount ?? '0');
  const checkoutUrl = cart?.checkoutUrl ?? null;

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        cartId,
        cart,
        items,
        itemCount,
        totalAmount,
        checkoutUrl,
        loading,
        error,
        addItem,
        addItems,
        removeItem,
        updateItemQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Alias for backwards compatibility
export const CartProvider = ShopifyProvider;

export default ShopifyProvider;
