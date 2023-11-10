import React from 'react'
import Layout from '../../components/layout/layout'
import AdminMenu from '../../components/layout/AdminMenu'

function Users() {
  return (
    <Layout>
        <div className="container-fluid m-3 p-3">
        <div id="row">
            <div id="col-md-3">
                <AdminMenu/>
            </div>
            <div id="col-md-3">
                All users 
        </div>
            </div>
        </div>
    </Layout>
  )
}

export default Users