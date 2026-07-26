import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ArtPiece } from '@/lib/supabase';

export type Currency = 'USD' | 'EUR';

interface CartItem {
  piece: ArtPiece;
  quantity: number;
}

interface StoreContextType {
  // Wishlist
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;

  // Shopping Cart
  cart: CartItem[];
  addToCart: (piece: ArtPiece) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number | null | undefined) => string;

  // Instant Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Conversion Rate: 1 USD = 0.92 EUR
const EUR_RATE = 0.92;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage persisted Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nous_art_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local storage persisted Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nous_art_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Currency selection
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      return (localStorage.getItem('nous_art_currency') as Currency) || 'USD';
    } catch {
      return 'USD';
    }
  });

  // Drawers & Modals
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('nous_art_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nous_art_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nous_art_currency', currency);
  }, [currency]);

  // Wishlist actions
  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlist.includes(id);
  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  // Cart actions
  const addToCart = (piece: ArtPiece) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.piece.id === piece.id);
      if (existing) {
        return prev.map((item) =>
          item.piece.id === piece.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { piece, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.piece.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.piece.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const p = item.piece.price ?? 0;
    return sum + p * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Search Modal actions
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Price Formatter based on Currency
  const formatPrice = (amount: number | null | undefined): string => {
    if (amount == null) return 'Price on Request';
    if (currency === 'EUR') {
      const eurValue = Math.round(amount * EUR_RATE);
      return eurValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    }
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };

  return (
    <StoreContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        currency,
        setCurrency,
        formatPrice,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
