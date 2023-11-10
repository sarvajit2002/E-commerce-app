import React from 'react'
import Layout from '../components/layout/layout'
import { useAuth } from '../context/Auth'
import ProductList from '../components/ProductList'
import ProductDetails from '../components/ProductDetails'
import { useState } from 'react';
import Cart from '../components/Cart'
function HomePages() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };
  const removeFromCart = (itemToRemove) => {
    const itemIndex = cartItems.findIndex(item => item === itemToRemove);

    if (itemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart.splice(itemIndex, 1);
      setCartItems(updatedCart);
    }
  };
  return (
    <Layout title={"Home Page"}>
    <h1>HomePages</h1>
    <ProductList addToCart={addToCart} />
      <Cart cartItems={cartItems} removeFromCart={removeFromCart}/>
    </Layout>
  )
}

export default HomePages