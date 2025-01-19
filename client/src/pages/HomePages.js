import React, { useState,useEffect } from 'react'
import Layout from '../components/layout/layout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Checkbox,Radio } from 'antd';
import toast from 'react-hot-toast';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart';
import Popup from './popup';
function HomePages() {
  const navigate = useNavigate();
  const [cart,setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const referralLink = "https://bitli.in/z2uH7xd";

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Something went wrong in getting category');
    }
  };

  const getAllProducts = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/products/product-list/${pageNum}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/v1/products/product-count');
      setTotal(data?.total);
    } catch (error) {
      console.error('Error fetching total products count:', error);
    }
  };
  useEffect(() => {
    // Show popup when the page loads
    setShowPopup(true);

    // Optional: Auto-close after a delay
    const timer = setTimeout(() => setShowPopup(false), 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts(page); // Fetch first page of products on component mount
  }, []);

  useEffect(() => {
    if (page > 1) {
      getAllProducts(page); // Fetch more products when page changes
    }
  }, [page]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
    setPage(1); // Reset page to 1 when filters change
  };
  useEffect(()=>{
    if(!checked.length || !radio.length);
    getAllProducts();
  },[checked.length,radio.length])
  useEffect(()=>{
    if(checked.length || radio.length)
    filterproduct()
  },[checked,radio])
  const filterproduct = async() => {
    try {
      const {data} = await axios.post('/api/v1/products/product-filters',{checked,radio})
      setProducts(data?.products)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // Show popup when the page loads
    setShowPopup(true);

    // Optional: Auto-close after a delay
    const timer = setTimeout(() => setShowPopup(false), 20000); // 10 seconds
    return () => clearTimeout(timer);
  }, []);
  return (
    <Layout title={"Home Page"}>
      <Popup 
        show={showPopup} 
        onClose={() => setShowPopup(false)} 
        referralLink={referralLink} 
      />
     <div className="container-fluid row mt-3">
       <div className="col-md-2">
        <h6 className='text-center'>Filter By Category</h6>
        <div className="d-flex flex-column">
        {categories.map((c)=>(
          <Checkbox key={c._id} onChange={(e)=>handleFilter(e.target.checked,c._id)}>
            {c.name}
          </Checkbox>
        ))}
        </div>
        <h6 className='text-center  mt-4'>Filter By Price</h6>
        <div className="d-flex flex-column">
          <Radio.Group onChange={(e)=>setRadio(e.target.value)}>
            {Prices?.map((p)=>(
              <div key={p._id}>
              <Radio value={p.array}>{p.name}</Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
        <div className='d-flex flex-column'>
          <button className='btn btn-danger' onClick={()=>window.location.reload()}>RESET FILTERS</button>
        </div>
       </div>
       <div className="col-md-9 offset-1">
       <h1 className="text-center">All Products</h1>
        <div className="d-flex flex-wrap">
          {products.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
              <img src={`/api/v1/products/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}</p>
                <p className="card-text">${p.price}</p>
                <button className="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                <button className="btn btn-secondary ms-1" onClick={()=>{setCart([...cart,p]);
                localStorage.setItem("cart",JSON.stringify([...cart,p]))
                  toast.success("Item Added to cart")}}>
                  Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
        {/* Load more button */}
        <div className="m-2 p-3">
          {products.length < total && (
            <button className="btn btn-warning" onClick={() => setPage(page + 1)}>
              {loading ? "Loading ..." : "Load More"}
            </button>
          )}
        </div>
       </div>
     </div>
    </Layout>
  )
}

export default HomePages