//Due to time constraints counld not complete the admin dashboard
import React from 'react'
import Layout from '../../components/layout/layout'
import AdminMenu from '../../components/layout/AdminMenu'
function CreateProduct() {
  return (
    <Layout>
        <div className="container-fluid m-3 p-3">
        <div id="row">
            <div id="col-md-3">
                <AdminMenu/>
            </div>
            <div id="col-md-3">
            Create Product
            </div>
        </div>
        </div>
    </Layout>
  )
}

export default CreateProduct