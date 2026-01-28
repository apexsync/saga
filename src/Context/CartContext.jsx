import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem('saga_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
  }, []);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('saga_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const cleanPrice = price.replace(/[^0-9.]/g, ''); // Remove non-numeric chars except dot
        return parseFloat(cleanPrice) || 0;
    }
    return 0;
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check for existing item by ID and Name to avoid collision if IDs are reused across categories
      const existingItem = prevItems.find(item => item.id === product.id && item.name === product.name);
      
      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id && item.name === product.name)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, productName) => {
     // Use both ID and Name for removal to match addToCart logic
    setCartItems(prevItems => prevItems.filter(item => !(item.id === productId && item.name === productName)));
  };

  const updateQuantity = (productId, productName, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId, productName);
        return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === productId && item.name === productName) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
        const price = parsePrice(item.price);
        return total + (price * item.quantity);
    }, 0);
  };
  
  const getCartCount = () => {
      return cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
