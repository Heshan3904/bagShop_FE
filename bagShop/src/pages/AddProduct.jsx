import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../services/productService";

import {
  FaTag,
  FaBoxes,
  FaMoneyBillWave,
  FaWarehouse,
  FaImage,
  FaShoppingBag,
} from "react-icons/fa";

import "./addproduct.css";
import Navibar from "../components/Navibar";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "Bag",
    brand: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelection = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > 3) {
      alert("You can only upload up to 3 images.");
      e.target.value = "";
      return;
    }

    const newPreviewImages = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImages(selectedFiles);
    setPreviewImages(newPreviewImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      Object.keys(product).forEach((key) => {
        formData.append(key, product[key]);
      });

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await addProduct(formData);

      alert(res.message);

      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navibar/>
    <div className="add-product-page">

      <div className="product-card">

        <div className="card-header">
          <FaShoppingBag className="header-icon" />
          <div>
            <h1>Add New Product</h1>
            <p>Create a new item for your store.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="left">

              <div className="input-box">
                <FaTag />
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <FaBoxes />
                <input
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={product.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="input-box">
                <FaMoneyBillWave />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <FaWarehouse />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={product.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option>Bag</option>
                <option>Wallet</option>
                <option>Accessories</option>
              </select>

              <textarea
                name="description"
                placeholder="Write product description..."
                value={product.description}
                onChange={handleChange}
                rows={6}
              />

            </div>

            <div className="right">

              <label className="upload-box">
                {previewImages.length > 0 ? (
                  <div className="upload-preview-grid">
                    {previewImages.map((preview, index) => (
                      <img key={`${preview}-${index}`} src={preview} alt={`preview-${index + 1}`} />
                    ))}
                  </div>
                ) : (
                  <>
                    <FaImage className="upload-icon" />
                    <p>Upload up to 3 product images</p>
                    <span>Click to browse</span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelection}
                />
              </label>

              {previewImages.length > 0 && (
                <p className="upload-hint">
                  {images.length}/3 images selected
                </p>
              )}

            </div>

          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>

        </form>

      </div>

    </div>
    </>
  );
}