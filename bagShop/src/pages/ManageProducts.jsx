import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllProducts,
  deleteProduct,
} from "../services/productService";

import "./manageproduct.css";
import Navibar from "../components/Navibar";
import Loading from "./Loading";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();

      setProducts(res.products);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      setProducts(products.filter((item) => item._id !== id));

      alert("Product deleted successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  return (
    <>
    <Navibar/>
    <div className="admin-container">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Manage Products</h2>

        <Link to="/admin/add-product">
          <button>Add Product</button>
        </Link>
      </div>

      <table className="product-table">

        <thead>

          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr key={product._id}>

              <td>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  width="80"
                  height="80"
                />
              </td>

              <td>{product.name}</td>

              <td>{product.category}</td>

              <td>{product.brand}</td>

              <td>LKR {product.price}</td>

              <td>{product.stock}</td>

              <td>

                <Link to={`/admin/edit-product/${product._id}`}>
                  <button>Edit</button>
                </Link>

                <button
                  onClick={() => handleDelete(product._id)}
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
    </>
  );
}