import React from 'react'
import { useSearch } from '../../context/search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function SearchInput() {
    const [values,setValues] = useSearch();
    const navigate=useNavigate()
    const handleSubmit = async (e) =>{
        e.preventDefault()
     try {
        const {data}=await axios.get(`/api/v1/products/search/${values.keyword}`)
        setValues({ ...values, results: Array.isArray(data) ? data : [] }); 
        navigate("/search")
     } catch (error) {
        console.log(error);
     }
    }
  return (
    <div>
        <form class='d-flex' role='search' onSubmit={handleSubmit}>
        <input class="form-control m-2"
        type="search"
        placeholder='Search'
        aria-label='Search' 
        value={values.keyword}
        onChange={(e)=> setValues({...values,keyword:e.target.value})}
        />
        <button className='btn btn-outline-success' type='submit'>
            Search
        </button>
        </form>
    </div>
  )
}

export default SearchInput