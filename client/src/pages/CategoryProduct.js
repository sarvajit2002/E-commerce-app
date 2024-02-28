import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/layout'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
function CategoryProduct() {
    const params = useParams();
    const navigate = useNavigate();
    const [products,setProducts] = useState([])
    const [category,setCategory] = useState([])
    useEffect(()=>{
        if(params?.slug) getProductbyCat();
    },[params?.slug])
    const getProductbyCat = async () => {
        try {
            const {data} = await axios.get(`/api/v1/products/product-category/${params.slug}`);
            setProducts(data?.product)
            setCategory(data?.category)
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Layout>
        <div className="container mt-3">
            <h1 className='text-center'>{category?.name}</h1>
            <h1 className='text-center'>{products?.length} result found</h1>
            <div className="row">
                 <h1 className='text-center'>All Products</h1>
        <div className='d-flex flex-wrap'>
        {products?.map((p)=>(
                    <div className="card m-2" style={{width:"18rem"}} >
                        <img src={`/api/v1/products/product-photo/${p._id}`} className='card-img-top' alt={p.name}/>
                      <div className="card-body">
                        <h5 className='card-title'>{p.name}</h5>
                        <p className='card-text'>{p.description.substring(0,30)}</p>
                        <p className='card-text'>${p.price}</p>
                        <button class="btn btn-primary ms-1" onClick={()=>navigate(`/products/${p.slug}`)}>More Details</button>
                        <button class="btn btn-secondary ms-1">Add to Cart</button>
                      </div>
                    </div>
                ))}
        </div>
        {/*<div className='m-2 p-3'>
         {products && products.length < total && (
          <button className='btn btn-warning' onClick={(e)=>{
            e.preventDefault()
            setPage(page+1)
          }}>
            {loading ? "Loading ..." : "Loadmore"}
          </button>
         )}
        </div>*/}
       </div>
         </div>
        
    </Layout>
  )
}

export default CategoryProduct