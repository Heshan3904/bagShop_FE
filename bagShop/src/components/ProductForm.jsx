import React, { useState } from "react";
import "./ProductForm.css";

const ProductForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    productId: "",
    category: "",
    name: "",
    mainImageLink: "",
    imageLinks: ["", "", "", "", ""],
    price: "",
    discountedPrice: "",
    quantity: "",
    status: "Online",
    description: "",
  });

  const [categories, setCategories] = useState([
    "Wallet",
    "Luggage",
    "Backpack",
    "Handbag",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageLinkChange = (index, value) => {
    setFormData((prev) => {
      const imageLinks = [...(prev.imageLinks || ["", "", "", "", ""])];
      imageLinks[index] = value;
      return {
        ...prev,
        imageLinks,
      };
    });
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const uploadFile = async (file, path) => {
    // not used when using only links
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.productId ||
        !formData.category ||
        !formData.name ||
        !formData.mainImageLink ||
        !formData.price ||
        !formData.quantity
      ) {
        alert("Please fill all required fields");
        setLoading(false);
        return;
      }

      const storedProducts = JSON.parse(localStorage.getItem("bagshop-products") || "[]");
      const exists = storedProducts.some((product) => product.productId === formData.productId);

      if (exists) {
        alert("Product ID already exists. Please use a unique Product ID.");
        setLoading(false);
        return;
      }

      const mainImageUrl = formData.mainImageLink.trim();
      const imageUrls = (formData.imageLinks || [])
        .map((link) => link && link.trim())
        .filter(Boolean)
        .slice(0, 5);

      const productData = {
        productId: formData.productId,
        category: formData.category,
        name: formData.name,
        mainImage: mainImageUrl,
        images: imageUrls,
        price: parseFloat(formData.price),
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : 0,
        quantity: parseInt(formData.quantity),
        status: formData.status,
        description: formData.description,
        createdAt: new Date().toISOString(),
      };

      storedProducts.push(productData);
      localStorage.setItem("bagshop-products", JSON.stringify(storedProducts));

      alert("Product added successfully! ✅");
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: "",
      category: "",
      name: "",
      mainImageLink: "",
      imageLinks: ["", "", "", "", ""],
      price: "",
      discountedPrice: "",
      quantity: "",
      status: "Online",
      description: "",
    });
    // clear any temporary previews (not used when links only)
    setNewCategory("");
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="form-title">Add New Product</h2>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Product ID */}
          <div className="form-group">
            <label>
              Product ID <span className="required">*</span>
            </label>
            <input
              type="text"
              name="productId"
              placeholder="e.g., PROD001"
              value={formData.productId}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>
              Category <span className="required">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="add-category">
              <input
                type="text"
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                type="button"
                onClick={addCategory}
                className="add-category-btn"
              >
                +
              </button>
            </div>
          </div>

          {/* Product Name */}
          <div className="form-group">
            <label>
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Main Image */}
          <div className="form-group">
            <label>
              Main Image (web link) <span className="required">*</span>
            </label>
            <input
              type="text"
              name="mainImageLink"
              placeholder="https://example.com/main.jpg"
              value={formData.mainImageLink}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Gallery Images */}
          <div className="form-group">
            <label>Gallery Images (up to 5 web links)</label>
            <div>
              {(formData.imageLinks || ["", "", "", "", ""]).map((link, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder={`Image ${index + 1} link (optional)`}
                    value={formData.imageLinks[index] || ""}
                    onChange={(e) => handleImageLinkChange(index, e.target.value)}
                    className="image-link-input"
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            {/* Price */}
            <div className="form-group">
              <label>
                Price <span className="required">*</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Discounted Price */}
            <div className="form-group">
              <label>Discounted Price</label>
              <input
                type="number"
                name="discountedPrice"
                placeholder="0.00"
                step="0.01"
                value={formData.discountedPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            {/* Quantity */}
            <div className="form-group">
              <label>
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="0"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Finish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
