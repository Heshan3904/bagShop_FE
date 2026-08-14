import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Admin from "./pages/Admin.jsx";
import ProtectedRoute from "./components/ProtectRoute.jsx";
import Profile from "./pages/Profile.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import ManageProducts from "./pages/ManageProducts.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminDashboard from "./pages/AdminDasshboard.jsx";
import CategoryProducts from "./pages/Categoryproduct.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route 
      path = "/admin"
      element = {
      <ProtectedRoute adminOnly={true}>
        <Admin />
      </ProtectedRoute>
      }
      />
      <Route
          path="/admin/add-product"
          element={
              <ProtectedRoute adminOnly = {true}>
                  <AddProduct />
              </ProtectedRoute>
          }
      />
      <Route
      path="admin/products"
      element={
        <ProtectedRoute adminOnly>
          <ManageProducts/>
        </ProtectedRoute>
      }
      />
      <Route
        path="/admin/edit-product/:id"
        element={
          <ProtectedRoute adminOnly>
            <EditProduct/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={<Products/>}
        />
      <Route
        path="/product/:id"
        element={<ProductDetails/>}
      />
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
      <Route path="/my-orders" element={<MyOrders/>}/>
      <Route path="/orders/:id" element={<OrderDetails/>}/>
      <Route path="/admin/orders" element={<AdminOrders/>}/>
      <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
      <Route path="/products/category/:category" element={<CategoryProducts/>}/>
    </Routes>

  );
}
export default App;