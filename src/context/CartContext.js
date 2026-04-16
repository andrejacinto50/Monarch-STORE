import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext();

function cleanZip(zip) {
  return zip.replace(/\D/g, '');
}

function calculateShippingByZip(zip, subtotal) {
  const clean = cleanZip(zip);

  if (!subtotal || clean.length !== 8) return 0;

  if (clean.startsWith('88')) return 18.9;
  if (clean.startsWith('89')) return 21.9;
  if (clean.startsWith('90')) return 26.9;
  if (clean.startsWith('01') || clean.startsWith('02')) return 24.9;

  return 32.9;
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [zip, setZip] = useState('');
  const [shipping, setShipping] = useState(0);

  const addToCart = (product, size = 'Único') => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setZip('');
    setShipping(0);
  };

  const calculateShipping = (zipValue, subtotalValue) => {
    const newShipping = calculateShippingByZip(zipValue, subtotalValue);
    setZip(zipValue);
    setShipping(newShipping);
    return newShipping;
  };

  const clearShipping = () => {
    setShipping(0);
  };

  const totals = useMemo(() => {
    const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    const recalculatedShipping =
      subtotal > 0 && cleanZip(zip).length === 8
        ? calculateShippingByZip(zip, subtotal)
        : 0;

    const total = subtotal + recalculatedShipping;

    return {
      itemsCount,
      subtotal,
      shipping: recalculatedShipping,
      total,
    };
  }, [cartItems, zip]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        zip,
        shipping,
        setZip,
        setShipping,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateShipping,
        clearShipping,
        ...totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);