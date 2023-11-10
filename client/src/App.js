import {Route,Routes} from "react-router-dom";
import HomePages from "./pages/HomePages";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import {ToastContainer} from "react-toastify"
import Dashboard from "./pages/user/Dashboard";
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from "./components/Routes/Private";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import AdminRoute from "./components/Routes/AdminRoutes";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from './pages/Admin/Users'
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePages/>}/>
      <Route path="/dashboard" element={<PrivateRoute/>}>
      <Route path="user" element={<Dashboard/>}/>
      <Route path="user/orders" element={<Orders/>}/>
      <Route path="user/profile" element={<Profile/>}/>
      </Route>
      <Route path="/dashboard" element={<AdminRoute/>}>
        <Route path="admin" element={<AdminDashboard/>}/>
        <Route path="admin/create-category" element={<CreateCategory/>}/>
        <Route path="admin/create-product" element={<CreateProduct/>}/>
        <Route path="admin/users" element={<Users />} />
        </Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgetPassword/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/policy" element={<Policy/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="*" element={<PageNotFound/>}/>
      <Route path="/" element={<ProductList/>} />
          <Route path="/products/:id" element={<ProductDetails/>} />
          <Route path="/cart" component={<Cart/>} />
    </Routes>
    </>
  );
}

export default App;
