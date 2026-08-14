import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductsByCategory } from "../services/productService";

import Navibar from "../components/Navibar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import "./categoryproduct.css";
import Loading from "./Loading";

export default function CategoryProducts() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProductsByCategory(category);

      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  if (loading) {
    return (
      <>
        <Loading/>
      </>
    );
  }

  return (
    <>
      <Navibar />

      <div className="category-page">

        <div className="category-header">
          <h1>{category}</h1>

          <p>
            Explore our {category.toLowerCase()} collection
          </p>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <h2>No products found</h2>

            <p>
              There are currently no products in this category.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
