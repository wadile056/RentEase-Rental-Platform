import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedTenure) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, selectedTenure } : item
        );
      }
      return [...prevItems, { ...product, selectedTenure }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const totalMonthlyRent = cartItems.reduce((acc, item) => acc + item.monthlyRent, 0);
  const totalSecurityDeposit = cartItems.reduce((acc, item) => acc + item.securityDeposit, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, clearCart, totalMonthlyRent, totalSecurityDeposit
    }}>
      {children}
    </CartContext.Provider>
  );
};