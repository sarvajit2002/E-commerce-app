import  Layout  from '../components/layout/layout'
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart';
import { useAuth } from '../context/Auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import toast from 'react-hot-toast';
function CartPage() {
  const [auth,setAuth] = useAuth();
  const [cart,setCart] = useCart();
  const navigate = useNavigate();
  const [clientToken,setClientToken] = useState("");
  const [instance,setInstance] = useState("");
  const [loading,setLoading] = useState(false);
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {total= total + item.price})
      return total.toLocaleString("en-US",{
        style:"currency",
        currency:"USD"
      });
    } catch (error) {
      console.log(error);
    }
  }
  const removeCartItem = (pid) => {
   try {
    let myCart = [...cart]
    let index = myCart.findIndex((item)=>item._id === pid)
    myCart.splice(index,1)
    setCart(myCart);
    localStorage.setItem('cart',JSON.stringify(myCart));
   } catch (error) {
     console.log(error);
   }
  }
  const getToken = async () => {
    try {
      const {data} = await axios.get('/api/v1/products/braintree/token');
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    getToken();
  },[auth?.token])
  const handlePayment = async () => {
    try {
      setLoading(true)
      const {nonce} = await instance.requestPaymentMethod()
      const {data} = await axios.post('/api/v1/products/braintree/payment',{
        nonce,cart 
      })
      setLoading(false);
      localStorage.removeItem('cart');
      setCart([])
      navigate('/dashboard/user/orders')
      toast.success('Payment Completed Successfully');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
     <Layout>
      <div className="container">
        <div className="row">
            <div className="col-md-12">
              <h1 className='text-center bg-light p-2 mb-1'>
                {!auth?.user ? "Hello Guest" : `Hello ${auth?.token && auth?.user?.name}`}
              </h1>
              <h4 className="text-center">
                 {cart?.length ? `You have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout"}`
                 :"Your Cart is empty"}
              </h4>
            </div>
        </div>
        <div className="row">
        <div className="col-md-8">
  {Array.isArray(cart) && cart.map((p) => (
    <div className="row mb-2 p-3 card flex-row" key={p._id}>
      <div className="col-md-4">
        <img
          src={`/api/v1/products/product-photo/${p._id}`}
          className="card-img-top"
          alt={p.name}
          width="100px"
          height={"100px"}
        />
      </div>
      <div className="col-md-8">
        <h4>{p.name}</h4>
        <p>{p.description.substring(0, 30)}</p>
        <h4>Price: {p.price}</h4>
        <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}>Remove</button>
      </div>
    </div>
  ))}
</div>

          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total|Checkout|Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
              <div className="mb-3">
                <h4>Current Address</h4>
                <h5>{auth?.user?.address}</h5>
                <button className='btn btn-outline-warning' onClick={()=>navigate("/dashboard/user/profile")}>Update Address</button>
              </div>
                </>
            ) : (
              <div className="mb-3">
                {
                  auth?.token ? (
                    <button className='btn btn-outline-warning' onClick={()=> navigate("/dashboard/user/profile")}>Update Address</button>
                  ) : (
                     <button className='btn btn-outline-warning' onClick={()=> navigate("/login",{
                      state:'/cart',
                     })}>Please Login to Checkout</button>
                  )
                }
              </div>
            )}
            <div className="mt-2">
              {
                !clientToken || !auth?.token || !cart?.length ? (" "):(
                  <>
                   <DropIn options={{
                     authorization:clientToken,
                     paypal:{
                       flow:'vault'
                     }
                   }}
                   onInstance={instance => setInstance(instance)}
                   />
                  </>
                )
              }
              <button className='btn btn-primary' onClick={handlePayment} 
              disabled={loading || !instance || !auth?.user?.address}>
                {loading ? "Processing..." : "Make Payment"}</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CartPage