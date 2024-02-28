import { Layout } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function ProductDetails() {
  const params = useParams()
  const navigate=useNavigate();
  const [product,setProduct] = useState({})
  const [relatedProducts,setRelatedProducts] = useState([]);
  useEffect(()=>{
    if(params?.slug)
    getProduct()
  },[params?.slug])
  const getProduct = async () =>{
    try {
      const {data} = await axios.get(`/api/v1/products/get-product/${params.slug}`)
      setProduct(data?.product)
      getSimilarProduct(data?.product._id,data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  }
  const getSimilarProduct = async (pid,cid) => {
    try {
    const {data} = await axios.get(`/api/v1/products/related-product/${pid}/${cid}`)
    setRelatedProducts(data?.products); 
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Layout>
    <h1>Product Details</h1>
    {Object.keys(product).length > 0 && (
      <div className="row container mt-2">
        <div className="col-md-6">
          <img 
             src={`/api/v1/products/product-photo/${product._id}`}
             className='card-img-top'
             alt={product.name}
             height="300"
             width={'350px'}
          />
        </div>
        <div className="col-md-6">
          <h1 className='text-center'>Product Details</h1>
          <h4>Name: {product.name}</h4>
          <h4>Description: {product.description}</h4>
          <h4>Price: {product.price}</h4>
          <h4>Category: {product.category && product.category.name}</h4> {/* Accessing the name property */}
          <h4>Shipping: {product.shipping}</h4>
          <button className="btn btn-secondary ms-1">ADD TO CART</button>
        </div>
      </div>
    )}
    <hr/>
    <div className="row-container">
      <h6>Similar Products</h6>
      {relatedProducts.length < 1 && (
        <p className='text-center'>No Similar Products</p>
      )}
      <div className="d-flex flex-wrap">
         {relatedProducts.map((p) => (
            <div className="card m-2" style={{width: "18rem"}} key={p._id}>
             <img   
               src={`/api/v1/products/product-photo/${p._id}`}
               className='card-img-top'
               alt={p.name}
             />
             <div className="card-body">
              <h5 className='card-titile'>{p.name}</h5>
              <p className='card-text'>{p.description.substring(0, 30)}...</p>
              <p className='card-text'>${p.price}</p>
              <button className='btn btn-primary ms-1' onClick={() => navigate(`/product/${p.slug}`)}>
               More Details
              </button>
              <button className='btn btn-secondary ms-1'>ADD TO CART</button>
             </div>
            </div>
         ))}
      </div>
    </div>
  </Layout>
  )
}

export default ProductDetails