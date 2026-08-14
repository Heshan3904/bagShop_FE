import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

import "./Products.css";
import GradientText from "../component/GradientText";
import Loading from "./Loading";

export default function Products() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {

    try{

      const res = await getAllProducts();

      setProducts(res.products);

    }catch(err){

      alert(err.message);

    }finally{

      setLoading(false);

    }

  };

  if(loading){

    return (
      <>
      <Loading/>
      </>
    );

  }

  return (

    <div className="products-page">

      <GradientText
              colors={["#23989A","#117173","#b0f0f1"]}
              animationSpeed={8}
              showBorder={false}
              className="custom-class"
              style={{ fontSize: '4rem', fontWeight: '500', textAlign: 'center', marginTop: '4rem' }}
            >
              Our Products
            </GradientText>
            <br />

      <div className="products-grid">

        {products.map(product=>(

          <ProductCard
              key={product._id}
              product={product}
          />

        ))}

      </div>

    </div>

  );

}