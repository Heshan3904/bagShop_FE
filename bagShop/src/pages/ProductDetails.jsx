import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import "./ProductDetails.css";
import Navibar from "../components/Navibar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/cartService";
import Loading from "./Loading";



export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const getImageList = (productData) => {
    const collectedImages = [];

    const pushCandidate = (candidate) => {
      if (Array.isArray(candidate)) {
        candidate.forEach((item) => {
          if (typeof item === "string" && item) {
            collectedImages.push(item);
          } else if (item && typeof item === "object") {
            const nestedImage =
              item.url ||
              item.image ||
              item.secure_url ||
              item.src;

            if (nestedImage) {
              collectedImages.push(nestedImage);
            }
          }
        });
      } else if (typeof candidate === "string" && candidate) {
        collectedImages.push(candidate);
      } else if (candidate && typeof candidate === "object") {
        const nestedImage =
          candidate.url ||
          candidate.image ||
          candidate.secure_url ||
          candidate.src;

        if (nestedImage) {
          collectedImages.push(nestedImage);
        }
      }
    };

    const candidates = [
      productData?.images,
      productData?.imageUrls,
      productData?.imageLinks,
      productData?.gallery,
      productData?.image,
      productData?.mainImage,
    ];

    candidates.forEach(pushCandidate);

    return collectedImages.filter(
      (image, index, self) => image && self.indexOf(image) === index
    ).slice(0, 3);
  };

  const loadProduct = async () => {
    try {
      const res = await getProductById(id);
      const productData = res.product;
      setProduct(productData);
      setSelectedImage(getImageList(productData)[0] || "");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddToCart = async () => {
  try {
    const imageList = getImageList(product);
    const imageUrl = selectedImage || imageList[0] || product?.image || "";

    await addToCart(product._id, quantity, imageUrl);

    alert("Product added to cart successfully!");

    navigate("/cart");
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to add product to cart."
    );
  }
};

  if (!product) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  const imageList = getImageList(product);

  return (
    <>
    <Navibar/>
    <div className="details-container">
      <div className="details-gallery">
        <div className="details-image">
          <img src={selectedImage || imageList[0] || product.image} alt={product.name} />
        </div>

        {imageList.length > 1 && (
          <div className="details-thumbnails">
            {imageList.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`details-thumb ${selectedImage === image ? "active" : ""}`}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="details-info">

        <h1>{product.name}</h1>

        <p className="category">{product.category}</p>

        <h2>LKR {product.price}</h2>

        <p>{product.description}</p>

        <h4>Brand : {product.brand}</h4>

        <h4>Stock : {product.stock}</h4>

        <div className="qty">

          <button
            onClick={() =>
              quantity > 1 && setQuantity(quantity - 1)
            }
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              quantity < product.stock &&
              setQuantity(quantity + 1)
            }
          >
            +
          </button>

        </div>

        <button className="cart-btn" onClick={handleAddToCart}>
          Add To Cart
        </button>

      </div>

    </div>
    <Footer/>
    </>
  );
}