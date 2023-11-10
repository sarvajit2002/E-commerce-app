import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetails = ({ match }) => {
  const [product, setProduct] = useState(null);
  const productId = match.params.id;

  useEffect(() => {
    // Fetch product details based on the ID from the URL
    axios.get(`${process.env.REACT_APP_API}/api/v1/products/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  return (
    <div>
      <h2>Product Details</h2>
      {product ? (
        <div>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          {/* Display other product details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
