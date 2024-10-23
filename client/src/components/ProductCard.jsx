import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function ProductCard({ product }) {
  const { t } = useTranslation();
  const [media, setMedia] = useState(product?.Media[0]?.source);
  const { openCart } = useContext(CartContext);
  const { setWishCount } = useContext(WishlistContext);
  const [isHovered, setIsHovered] = useState(false);
  const [heart, setHeartFill] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => item.name === product.Name);
  });

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const productDetails = {
      name: product.Name,
      media: product.Media[0]?.source,
      price: product.Price,
      discountedPrice: product.DiscountedPrice || null,
    };

    const existingIndex = wishlist.findIndex(
      (item) => item.name === product.Name
    );

    if (existingIndex !== -1) {
      // Remove product from wishlist
      wishlist.splice(existingIndex, 1);
      setHeartFill(false);
    } else {
      // Add product to wishlist
      wishlist.push(productDetails);
      setHeartFill(true);
    }
    setWishCount(wishlist.length);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const handleAddToCartItem = () => {
    const sanitize = (str) => str.replace(/[^\w-]/g, "-");
    const cookieName = sanitize(
      "cart" + product.Name + product?.Sizes[0] + product?.Colors[0]
    );
    cookies.set(
      cookieName,
      {
        productName: product.Name,
        productMedia: product.Media[0].source,
        productPrice: product?.DiscountedPrice || product.Price,
        productQty: 1,
        productSize: product?.Sizes[0],
        productColor: product?.Colors[0],
        cookieName,
      },
      {
        maxAge: 172800, // 2 days
        sameSite: true,
        secure: true,
        path: "/",
      }
    );
    openCart();
  };

  return (
    <div className="product-card">
      <div
        className="product-card-media"
        onMouseOver={() => {
          setMedia(product.Media[1]?.source || product.Media[0]?.source);
          setIsHovered(true);
        }}
        onMouseOut={() => {
          setMedia(product.Media[0]?.source);
          setIsHovered(false);
        }}
      >
        {product.Ribbon === "sale" && (
          <span className="product-card-ribbon sale">
            {product.DiscountPercentage}%
          </span>
        )}
        {product.Ribbon === "new" && (
          <span className="product-card-ribbon new">{t("ribbon_new")}</span>
        )}
        <Link to={`/products/${product.Name}`}>
          {media?.includes("video") ? (
            <video autoPlay loop muted>
              <source src={media} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={media} alt={`${product.Name} Image`} />
          )}
        </Link>
        <span
          className="product-card-heart-icon"
          onClick={handleWishlistToggle}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 7C8.239 7 6 9.216 6 11.95C6 14.157 6.875 19.395 15.488 24.69C15.6423 24.7839 15.8194 24.8335 16 24.8335C16.1806 24.8335 16.3577 24.7839 16.512 24.69C25.125 19.395 26 14.157 26 11.95C26 9.216 23.761 7 21 7C18.239 7 16 10 16 10C16 10 13.761 7 11 7Z"
              stroke="black"
              fill={heart ? "#000" : "none"}
              strokeWidth="2.2"
            />
          </svg>
        </span>
        <button
          className={isHovered ? "addToCart-btn active" : "addToCart-btn"}
          onClick={handleAddToCartItem}
        >
          {t("Add_To_Cart")}
        </button>
      </div>
      <div className="product-info">
        <div className="product-card-name">
          <Link to={`/products/${product.Name}`}>{product.Name}</Link>
        </div>
        <div className="product-card-prices">
          <div className="product-card-current-price">
            PKR {product.DiscountedPrice || product.Price}
          </div>
          {product.DiscountedPrice > 0 && (
            <div className="product-card-previous-price">
              PKR {product.Price}
            </div>
          )}
        </div>
        {product?.RatingQty > 0 && (
          <div className="product-rating">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <span key={num + index}>
                  <input
                    value={index}
                    id={`star${index}`}
                    type="radio"
                    defaultChecked={product?.AverageRating > num}
                  />
                  <label htmlFor={`star${index}`}></label>
                </span>
              ))}
            </div>
            <div className="rating-qty">({product?.RatingQty})</div>
          </div>
        )}
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default ProductCard;
