import React,{useState,useEffect} from 'react'
import Layout from '../../components/layout/layout'
import UserMenu from '../../components/layout/UserMenu'
import axios from 'axios'
import { useAuth } from '../../context/Auth'
import moment from 'moment';
function Orders() {
  const [orders,setOrders] = useState([])
  const [auth,setAuth] = useAuth()
  const getOrders = async() =>{
    try {
      const {data} = await axios.get('/api/v1/auth/orders')
      setOrders(data)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    if(auth?.token){
      getOrders()
    }
  },[auth?.token])
  return (
    <Layout title={"Your Orders"}>
       <div className="container-flui p-3 m-3">
        <div className="row">
            <div className="col-md-3">
                <UserMenu/>
            </div>
            <div className="col-md-9">
                <h1 className='text-center'>All Orders</h1>
               {
                orders?.map((o,i)=>{
                  return(
                    <div className='border-shadow'>
                     <table className='table'>
                      <thead>
                       <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Buyer</th>
                        <th scope='col'>Orders</th>
                        <th scope='col'>Payment</th>
                        <th scope='col'>Quantity</th>
                       </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>{i + 1}</th>
                          <th>{o?.status}</th>
                          <th>{o?.buyer?.name}</th>
                          <th>{moment(o?.createAt).fromNow()}</th>
                          <th>{o?.payment.success ? "Success" : "Failed"}</th>
                          <th>{o?.products?.length}</th>
                        </tr>
                      </tbody>
                     </table>
                     <div className="container">
                     {o?.products?.map((p,i) => (
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
      </div>
    </div>
  ))}
                     </div>
                    </div>
                  )
                })
               }
            </div>
        </div>
       </div>
    </Layout>
  )
}

export default Orders