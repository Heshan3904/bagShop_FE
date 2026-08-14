import { Link } from "react-router-dom";
import "./category.css";

const categories = [
  { name: "Bags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", to: "/products/category/Bag" },
  { name: "Wallets", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85", to: "/products/category/Wallet" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85", to: "/products/category/Accessories" },
  { name: "All", image: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=85", to: "/products" },
];

export default function Category() {
  return (
    <section id="categories" className="category-section" aria-label="Shop by category">
      <div className="category-grid">
        {categories.map((category) => (
          <Link className="category-card" to={category.to} key={category.name}>
            <img src={category.image} alt={category.name} />
            <span className="category-overlay" aria-hidden="true" />
            <span className="category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
