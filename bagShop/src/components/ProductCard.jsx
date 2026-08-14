import { Link } from "react-router-dom";
import './ProductCard.css';




export default function ProductCard({ product }) {
  const imageUrl = Array.isArray(product.images)
    ? product.images[0]
    : product.images || product.image || "";

  return (
    <div className="product-card">
      <Link className="product-image-wrap" to={`/product/${product._id}`} aria-label={`View ${product.name}`}>
        <img src={imageUrl} alt={product.name || "Product image"} />
      </Link>

      <div className="product-body">
        <Link className="product-name" to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-price">LKR {Number(product.price || 0).toLocaleString()}</p>
        <div className="product-footer">
          <span className={`availability ${product.stock > 0 ? "available" : "unavailable"}`}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
