import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import AdminMenu from '../../components/layout/AdminMenu'
import toast from 'react-hot-toast'
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from 'antd';
function CreateCategory() {
    const [categories,setCategories] = useState([])
    const [name,setName]=useState("")
    const [visible,setVisible] = useState(false);
    const [selected,setSelected] = useState(null);
    const [updatedName,setUpdatedName]=useState(" ");
    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post("/api/v1/category/create-category",{
            name,
            });
            if(data?.success){
                toast.success(`${name} created`)
                getAllCategory();
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in input form')
        }
    }
    const getAllCategory = async () => {
        try {
            const {data} = await axios.get("/api/v1/category/get-category");
            if(data.success){
                setCategories(data.category);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in getting category')
        }
    }
    useEffect(()=>{
        getAllCategory();
    },[])
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
           const {data} = await axios.put(`/api/v1/category/update-category/${selected._id}`,{name:updatedName});
           if(data.success){
            toast.success(`${updatedName} is updated`);
            setSelected(null)
            setUpdatedName("")
            setVisible(false);
            getAllCategory();
           }else{
            toast.error(data.message)
           }
        } catch (error) {
            toast.error('Something Went Wrong')
        }
    }
    const handleDelete = async (pId) => {
        
        try {
           const {data} = await axios.delete(`/api/v1/category/delete-category/${pId}`);
           if(data.success){
            toast.success(`${name} is deleted`);
            getAllCategory();
           }else{
            toast.error(data.message)
           }
        } catch (error) {
            toast.error('Something Went Wrong')
        }
    }
  return (
    <Layout title={"Dashboard-Create Category"}>
        <div className="container-fluid m-3 p-3">    
    <div id="row">
        <div id="col-md-3">
            <AdminMenu/>
        </div>
        <div id="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
                <CategoryForm
                 handleSubmit={handlesubmit}
                 value={name}
                 setValue={setName}
                />
            </div>
            <div className='w-75'>
           <table className="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
      {categories?.map((c)=>(
          <>
        <tr>
        <td key={c._id}>{c.name}</td>
        <td>
            <button className='btn btn-primary ms-2'
            onClick={()=>{setVisible(true);setUpdatedName(c.name);setSelected(c)}}
            >Edit</button>
            <button className='btn btn-danger ms-2'
            onClick={()=>{handleDelete(c._id)}}>Delete</button>
        </td>
        </tr>
        </>
      ))}
  </tbody>
</table>
            </div>
            <Modal onCancel={()=>setVisible(false)} footer={null} visible={visible}>
                <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
            </Modal>
        </div>
        </div>
    </div>
</Layout>
  )
}

export default CreateCategory