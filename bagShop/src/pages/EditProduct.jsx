import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import {
  getProductById,
  updateProduct,
} from "../services/productService";

import "./edit.css";
import Navibar from "../components/Navibar";
import Loading from "./Loading";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState("");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "Bag",
    brand: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

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
    setPreview(newPreviewImages[0] || "");
  };

  const loadProduct = async () => {
    try {
      const res = await getProductById(id);

      const p = res.product;

      setProduct({
        name: p.name,
        description: p.description,
        category: p.category,
        brand: p.brand,
        price: p.price,
        stock: p.stock,
      });

      setPreview(p.image);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("brand", product.brand);
      formData.append("price", product.price);
      formData.append("stock", product.stock);

      if (images.length > 0) {
        images.forEach((file) => formData.append("images", file));
      }

      await updateProduct(id, formData);

      alert("Product updated successfully.");

      navigate("/admin/products");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <>
    <Navibar/>
    <div className="admin-container">

      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} className="admin-form">

        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
        >
          <option value="Bag">Bag</option>
          <option value="Wallet">Wallet</option>
          <option value="Accessories">Accessories</option>
        </select>

        <input
          name="brand"
          value={product.brand}
          onChange={handleChange}
          placeholder="Brand"
        />

        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />

        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "180px",
              borderRadius: "10px",
            }}
          />
        )}

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

        <button type="submit">
          Update Product
        </button>

      </form>

    </div>
    </>
  );
}