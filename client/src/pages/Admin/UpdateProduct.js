import React,{useState,useEffect} from 'react'
import Layout from '../../components/layout/layout'
import AdminMenu from '../../components/layout/AdminMenu'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Select } from 'antd'
import { useNavigate,useParams } from 'react-router-dom'
const {Option} = Select
function UpdateProduct() {
    const Navigate = useNavigate();
    const params = useParams();
    const [categories,setCategories] = useState([])
  const [name,setName]= useState("")
  const [description,setDescription]= useState("")
  const [price,setPrice]= useState("")
  const [category,setCategory] = useState("");
  const [quantity,setQuantity]= useState("")
  const [shipping,setShipping]= useState("")
  const [photo,setPhoto] = useState("")
  const [id,setId] = useState("")
  const getSingleProduct = async(e)=>{
    try {
        const {data} = await axios.get(`/api/v1/products/get-product/${params.slug}`)
        setName(data.product.name)
        setId(data.product._id)
        setDescription(data.product.description)
        setPrice(data.product.price)
        setQuantity(data.product.quantity)
        setPhoto(data.product.photo)
        setShipping(data.product.shipping)
        setCategory(data.product.category._id)
    } catch (error) {
        console.log(error);
    }
  }
  useEffect(()=>{
    getSingleProduct();
  },[])
  const getAllCategory = async () => {
    try {
        const {data} = await axios.get("/api/v1/category/get-category");
        if(data?.success){
            setCategories(data?.category);
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong in getting category')
    }
}
const handleUpdate = async (e) =>{
   e.preventDefault();
   try {
     const productData = new FormData()
     productData.append("name",name)
     productData.append("description",description)
     productData.append("price",price)
     productData.append("quantity",quantity)
     photo && productData.append("photo",photo)
     productData.append("category",category)
     const {data} = await axios.put(`/api/v1/products/update-products/${id}`,productData)
     if(data?.success){
       toast.error(data?.message)
      }else{
       toast.success("Product Updated Successfully")
       Navigate("/dashboard/admin/products")
     }
   } catch (error) {
     console.log(error);
     toast.error("Something went wrong")
   }
}
const handleDelete = async () =>{
  try {
    let answer=window.prompt('Are You Sure You want to delete this Product')
    if(!answer) return;
    const {data} = await axios.delete(`/api/v1/products/delete-products/${id}`)
    toast.success('Product Deleted Successfully')
    Navigate('/dashboard/admin/products')
  } catch (error) {
   console.log(error);
   toast.error('Something went wrong')
  }
}
useEffect(()=>{
    getAllCategory();
},[])
  return (
    <Layout>
    <div className="container-fluid m-3 p-3">
    <div id="row">
        <div id="col-md-3">
            <AdminMenu/>
        </div>
        <div id="col-md-9">
        Update Product
        <div className="m-1 w-75">
          <Select bordered={false} placeholder="Select a category" size='large' showSearch 
          className='form-select mb-3' onChange={(value)=>{setCategory(value)}} value={category}>
           {categories?.map((c)=>{
           return <Option key={c._id} value={c._id}>{c.name}</Option>
           })}
          </Select>
           <div className="mb-3">
           <label htmlFor="fileInput" className='btn btn-outline-secondary col-md-12'>
         {photo ? photo.name : "Upload Photo"}
           <input
            type="file"
            id="fileInput"
            name="photo"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            style={{ display: 'none' }}
            />
            </label>
           </div>
           <div className="mb-3">
            {photo ? (
              <div className='text-center'>
                <img src={URL.createObjectURL(photo)} alt='product-photo'height={'200px'} className='img img-responsive'/>
              </div>
            ):(
              <div className='text-center'>
                <img src={`/api/v1/products/product-photo/${id}`} alt='product-photo'height={'200px'} className='img img-responsive'/>
              </div>
            )}
           </div>
           <div className="mb-3">
            <input type="text" value={name} placeholder='write a name' className='form-control' onChange={(e)=>setName(e.target.value)} />
           </div>
           <div className="mb-3">
            <input type="text" value={description} placeholder='write a description' className='form-control' onChange={(e)=>setDescription(e.target.value)} />
           </div>
           <div className="mb-3">
            <input type="number" value={price} placeholder='write a price' className='form-control' 
            onChange={(e)=>setPrice(e.target.value)} />
           </div>
           <div className="mb-3">
            <input type="number" value={quantity} placeholder='write the quantity' className='form-control' 
            onChange={(e)=>setQuantity(e.target.value)} />
           </div>
           <div className="mb-3">
            <Select bordered={false} size='large' showSearch className='form-select mb-3' placeholder='select shipping' 
            onChange={(value)=>setShipping(value)} value={shipping ? "yes":"no"} >
              <Option value='0'>No</Option>
              <Option value='1'>Yes</Option>
            </Select>
           </div>
           <div className="mb-3">
            <button className='btn btn-primary' onClick={handleUpdate}>UPDATE PRODUCT</button>
           </div>
           <div className="mb-3">
            <button className='btn btn-danger' onClick={handleDelete}>DELETE PRODUCT</button>
           </div>
        </div>
        </div>
    </div>
    </div>
</Layout>
  )
}

export default UpdateProduct