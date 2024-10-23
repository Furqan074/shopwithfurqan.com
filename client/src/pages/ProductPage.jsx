import ProductRow from "../components/ProductRow";
import MediaSlider from "../components/ProductPage/MediaSlider";
import ReviewsSection from "../components/ProductPage/ReviewsSection";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import Cookies from "universal-cookie";
import Loading from "../components/Loading";
import PageNotFound from "../pages/PageNotFound.jsx";
const cookies = new Cookies();

const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function ProductPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const capitalizedName = capitalizeWords(name || "");
  document.title = capitalizedName + " | Shopwithfurqan";
  const { openCart } = useContext(CartContext);
  const { setWishCount } = useContext(WishlistContext);
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [productQty, setProductQty] = useState(1);
  const [colorWarning, setColorWarning] = useState("");
  const [sizeWarning, setSizeWarning] = useState("");
  const [shippingWarning, setShippingWarning] = useState("");
  const [heart, setHeartFill] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [productNotFound, setProductNotFound] = useState(false);

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const productDetails = {
      name: product.Name,
      media: product.Media[0].source,
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

  const handleInputChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (newValue >= 1 && newValue <= 50) {
      setProductQty(newValue);
    }
  };

  const handleAddToCartItem = () => {
    if (!selectedColor && product?.Colors?.[0] !== "") {
      setColorWarning("Please Select a Color");
      setSizeWarning("");
      setShippingWarning("");
      return;
    }
    if (!selectedSize && product?.Sizes?.[0] !== "") {
      setSizeWarning("Please Select a Size");
      setColorWarning("");
      setShippingWarning("");
      return;
    }
    if (!selectedShipping && product?.Shipping === "true") {
      setShippingWarning("Please Select a Shipping fee");
      setColorWarning("");
      setSizeWarning("");
      return;
    }
    setSizeWarning("");
    setColorWarning("");
    setShippingWarning("");
    const sanitize = (str) => str.replace(/[^\w-]/g, "-");
    const cookieName = sanitize(
      "cart" + product.Name + selectedSize + selectedColor
    );
    cookies.set(
      cookieName,
      {
        productName: product.Name,
        productMedia: product.Media[0].source,
        productPrice: product?.DiscountedPrice || product.Price,
        productQty: productQty,
        productSize: selectedSize,
        productColor: selectedColor,
        productShippingFee: Number(selectedShipping),
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
  const handleBuyNowItem = () => {
    if (!selectedColor && product?.Colors?.[0] !== "") {
      setColorWarning("Please Select a Color");
      setSizeWarning("");
      setShippingWarning("");
      return;
    }
    if (!selectedSize && product?.Sizes?.[0] !== "") {
      setSizeWarning("Please Select a Size");
      setColorWarning("");
      setShippingWarning("");
      return;
    }
    if (!selectedShipping && product?.Shipping === "true") {
      setShippingWarning("Please Select a Shipping fee");
      setColorWarning("");
      setSizeWarning("");
      return;
    }
    setSizeWarning("");
    setColorWarning("");
    setShippingWarning("");
    const sanitize = (str) => str.replace(/[^\w-]/g, "-");
    const cookieName = sanitize(
      "cart" + product.Name + selectedSize + selectedColor
    );
    cookies.set(
      cookieName,
      {
        productName: product.Name,
        productMedia: product.Media[0].source,
        productPrice: product?.DiscountedPrice || product.Price,
        productQty: productQty,
        productSize: selectedSize,
        productColor: selectedColor,
        productShippingFee: Number(selectedShipping),
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
    navigate("/checkout");
  };

  const handleDecrement = () => {
    setProductQty((prevQty) => Math.max(prevQty - 1, 1));
  };

  const handleIncrement = () => {
    setProductQty((prevQty) => Math.min(prevQty + 1, 50));
  };

  const getProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/${name}`
      );
      const data = await response.json();

      if (data.success) {
        setProduct(data.productFound);
        setRelatedProducts(data.relatedProductsFound);

        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setHeartFill(
          wishlist.some((item) => item.name === data.productFound.Name)
        );
      } else if (response.status === 404) {
        setProductNotFound(true);
      } else {
        setProduct([]);
        setRelatedProducts([]);
        setHeartFill(false);
      }
    } catch (error) {
      console.error("Error Getting Products:", error);
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  return isLoading ? (
    <Loading />
  ) : productNotFound ? (
    <PageNotFound />
  ) : (
    <section className="product-page-section">
      <div className="product-block">
        <div className="product-medias-gallery">
          <MediaSlider medias={product.Media} />
        </div>
        <div className="product-details">
          <h1>{i18n.language === "ur" ? product.NameInUr : product.Name}</h1>
          <h2>
            {i18n.language === "ur" ? product.MaterialInUr : product.Material}
          </h2>
          <div className="product-rating">
            {product?.AverageRating > 0 && (
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
            )}
            <div className="rating-qty">
              <span>
                ({product.RatingQty} {t("reviews")})
              </span>
              |
              {product.Stock > 0 || product.Stock === null ? (
                <span className="stock-in">{t("in_stock")}</span>
              ) : (
                <span className="stock-out">{t("out_stock")}</span>
              )}
            </div>
          </div>
          <div className="product-price">
            <span className="product-discounted-price">
              PKR {product.DiscountedPrice || product.Price}
            </span>
            {product.DiscountedPrice > 0 && (
              <span className="product-actual-price">PKR {product.Price}</span>
            )}
          </div>
          <div className="product-desc">
            <span>
              {i18n.language === "ur"
                ? product.DescriptionInUr
                : product.Description}
            </span>
          </div>
          <span className="divider"></span>
          {product?.Colors?.[0] !== "" && (
            <div className="product-colors">
              <div className="color-label">{t("color")}:</div>
              <div className="colors">
                {product?.Colors?.map((color, index) => (
                  <span
                    key={color + index}
                    className={`color ${
                      color === selectedColor ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}
          {colorWarning && <span style={{ color: "red" }}>{colorWarning}</span>}
          {product?.Sizes?.[0] !== "" && (
            <div className="product-sizes">
              <div className="size-label">{t("size")}:</div>
              <div className="sizes">
                {product?.Sizes?.map((size, index) => (
                  <span
                    key={size + index}
                    className={`size ${
                      size === selectedSize ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
          {sizeWarning && <span style={{ color: "red" }}>{sizeWarning}</span>}
          <div className="product-counter">
            <button
              className="qty"
              onClick={handleDecrement}
              style={{ borderRight: "1px solid rgb(0, 0, 0, 0.5)" }}
            >
              <svg
                width="18"
                height="2"
                viewBox="0 0 18 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 1H1"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              type="number"
              value={productQty}
              min={1}
              max={50}
              onChange={handleInputChange}
            />
            <button
              className="qty"
              onClick={handleIncrement}
              style={{ borderLeft: "1px solid rgb(0, 0, 0, 0.5)" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 17V9M9 9V1M9 9H17M9 9H1"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          {shippingWarning && (
            <span style={{ color: "red" }}>{shippingWarning}</span>
          )}
          {product?.Shipping === "true" && (
            <>
              <div
                className={`shipping ${
                  selectedShipping === "150" ? "selected" : ""
                }`}
                onClick={() => setSelectedShipping("150")}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6666 31.6667C13.5076 31.6667 15 30.1743 15 28.3333C15 26.4924 13.5076 25 11.6666 25C9.8257 25 8.33331 26.4924 8.33331 28.3333C8.33331 30.1743 9.8257 31.6667 11.6666 31.6667Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28.3333 31.6667C30.1743 31.6667 31.6667 30.1743 31.6667 28.3333C31.6667 26.4924 30.1743 25 28.3333 25C26.4924 25 25 26.4924 25 28.3333C25 30.1743 26.4924 31.6667 28.3333 31.6667Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.33331 28.3335H6.99998C5.89541 28.3335 4.99998 27.4381 4.99998 26.3335V21.6668M3.33331 8.3335H19.6666C20.7712 8.3335 21.6666 9.22893 21.6666 10.3335V28.3335M15 28.3335H25M31.6667 28.3335H33C34.1046 28.3335 35 27.4381 35 26.3335V18.3335M35 18.3335H21.6666M35 18.3335L30.5826 10.9712C30.2211 10.3688 29.5701 10.0002 28.8676 10.0002H21.6666"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 28H6.66667C5.5621 28 4.66667 27.1046 4.66667 26V21.3333M3 8H19.3333C20.4379 8 21.3333 8.89543 21.3333 10V28M15 28H24.6667M32 28H32.6667C33.7712 28 34.6667 27.1046 34.6667 26V18M34.6667 18H21.3333M34.6667 18L30.2493 10.6377C29.8878 10.0353 29.2368 9.66667 28.5343 9.66667H21.3333"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 11.8182H11.6667"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.81818 15.4546H8.48484"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 19.0909H11.6667"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{t("inside_sindh_label")}</span>
              </div>
              <div
                className={`shipping ${
                  selectedShipping === "250" ? "selected" : ""
                }`}
                onClick={() => setSelectedShipping("250")}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6666 31.6667C13.5076 31.6667 15 30.1743 15 28.3333C15 26.4924 13.5076 25 11.6666 25C9.8257 25 8.33331 26.4924 8.33331 28.3333C8.33331 30.1743 9.8257 31.6667 11.6666 31.6667Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28.3333 31.6667C30.1743 31.6667 31.6667 30.1743 31.6667 28.3333C31.6667 26.4924 30.1743 25 28.3333 25C26.4924 25 25 26.4924 25 28.3333C25 30.1743 26.4924 31.6667 28.3333 31.6667Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.33331 28.3335H6.99998C5.89541 28.3335 4.99998 27.4381 4.99998 26.3335V21.6668M3.33331 8.3335H19.6666C20.7712 8.3335 21.6666 9.22893 21.6666 10.3335V28.3335M15 28.3335H25M31.6667 28.3335H33C34.1046 28.3335 35 27.4381 35 26.3335V18.3335M35 18.3335H21.6666M35 18.3335L30.5826 10.9712C30.2211 10.3688 29.5701 10.0002 28.8676 10.0002H21.6666"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 28H6.66667C5.5621 28 4.66667 27.1046 4.66667 26V21.3333M3 8H19.3333C20.4379 8 21.3333 8.89543 21.3333 10V28M15 28H24.6667M32 28H32.6667C33.7712 28 34.6667 27.1046 34.6667 26V18M34.6667 18H21.3333M34.6667 18L30.2493 10.6377C29.8878 10.0353 29.2368 9.66667 28.5343 9.66667H21.3333"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 11.8182H11.6667"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.81818 15.4546H8.48484"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 19.0909H11.6667"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{t("outside_sindh_label")}</span>
              </div>
            </>
          )}
          {product?.Shipping === "false" && (
            <div className="shipping">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6666 31.6667C13.5076 31.6667 15 30.1743 15 28.3333C15 26.4924 13.5076 25 11.6666 25C9.8257 25 8.33331 26.4924 8.33331 28.3333C8.33331 30.1743 9.8257 31.6667 11.6666 31.6667Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.3333 31.6667C30.1743 31.6667 31.6667 30.1743 31.6667 28.3333C31.6667 26.4924 30.1743 25 28.3333 25C26.4924 25 25 26.4924 25 28.3333C25 30.1743 26.4924 31.6667 28.3333 31.6667Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.33331 28.3335H6.99998C5.89541 28.3335 4.99998 27.4381 4.99998 26.3335V21.6668M3.33331 8.3335H19.6666C20.7712 8.3335 21.6666 9.22893 21.6666 10.3335V28.3335M15 28.3335H25M31.6667 28.3335H33C34.1046 28.3335 35 27.4381 35 26.3335V18.3335M35 18.3335H21.6666M35 18.3335L30.5826 10.9712C30.2211 10.3688 29.5701 10.0002 28.8676 10.0002H21.6666"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 28H6.66667C5.5621 28 4.66667 27.1046 4.66667 26V21.3333M3 8H19.3333C20.4379 8 21.3333 8.89543 21.3333 10V28M15 28H24.6667M32 28H32.6667C33.7712 28 34.6667 27.1046 34.6667 26V18M34.6667 18H21.3333M34.6667 18L30.2493 10.6377C29.8878 10.0353 29.2368 9.66667 28.5343 9.66667H21.3333"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 11.8182H11.6667"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.81818 15.4546H8.48484"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 19.0909H11.6667"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t("Free_Delivery_label")}</span>
            </div>
          )}
          <div className="product-cart-concern">
            <button className="add-to-cart-btn" onClick={handleAddToCartItem}>
              {t("Add_To_Cart")}
            </button>
            <button className="buy-now-btn" onClick={handleBuyNowItem}>
              {t("Buy_Now")}
            </button>
            <button className="add-wish-btn" onClick={handleWishlistToggle}>
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill={heart ? "#000" : "none"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 1C3.239 1 1 3.216 1 5.95C1 8.157 1.875 13.395 10.488 18.69C10.6423 18.7839 10.8194 18.8335 11 18.8335C11.1806 18.8335 11.3577 18.7839 11.512 18.69C20.125 13.395 21 8.157 21 5.95C21 3.216 18.761 1 16 1C13.239 1 11 4 11 4C11 4 8.761 1 6 1Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {product?.AverageRating > 0 && (
        <ReviewsSection
          averageRating={product?.AverageRating}
          ratingLabel={product?.RatingLabel}
          reviews={product?.Reviews}
        />
      )}
      {/* <div className="pagination">
        <div>
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.37939 0.364748C7.48811 0.479616 7.57436 0.616059 7.63321 0.766264C7.69206 0.91647 7.72235 1.07749 7.72235 1.2401C7.72235 1.40272 7.69206 1.56374 7.63321 1.71395C7.57436 1.86415 7.48811 2.00059 7.37939 2.11546L2.82916 6.93303L7.37939 11.7506C7.59867 11.9828 7.72185 12.2976 7.72185 12.626C7.72185 12.9543 7.59867 13.2692 7.37939 13.5013C7.16011 13.7335 6.86271 13.8639 6.55261 13.8639C6.24251 13.8639 5.9451 13.7335 5.72583 13.5013L0.342952 7.80218C0.234235 7.68731 0.147983 7.55087 0.0891333 7.40066C0.0302835 7.25046 -7.62939e-06 7.08944 -7.62939e-06 6.92682C-7.62939e-06 6.76421 0.0302835 6.60319 0.0891333 6.45298C0.147983 6.30278 0.234235 6.16634 0.342952 6.05147L5.72583 0.352331C6.17147 -0.119493 6.92202 -0.119493 7.37939 0.364748Z"
              fill="#DB4444"
            />
          </svg>
          <span className="pagination-numbers active">1</span>
          <span className="pagination-numbers">2</span>
          <span className="pagination-numbers">3</span>
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.342961 0.364748C0.234244 0.479616 0.147992 0.616059 0.0891419 0.766264C0.0302921 0.91647 0 1.07749 0 1.2401C0 1.40272 0.0302921 1.56374 0.0891419 1.71395C0.147992 1.86415 0.234244 2.00059 0.342961 2.11546L4.89319 6.93303L0.342961 11.7506C0.123685 11.9828 0.000496575 12.2976 0.000496575 12.626C0.000496575 12.9543 0.123685 13.2692 0.342961 13.5013C0.562237 13.7335 0.859639 13.8639 1.16974 13.8639C1.47985 13.8639 1.77725 13.7335 1.99652 13.5013L7.3794 7.80218C7.48812 7.68731 7.57437 7.55087 7.63322 7.40067C7.69207 7.25046 7.72236 7.08944 7.72236 6.92682C7.72236 6.76421 7.69207 6.60319 7.63322 6.45298C7.57437 6.30278 7.48812 6.16634 7.3794 6.05147L1.99652 0.352331C1.55088 -0.119493 0.800329 -0.119493 0.342961 0.364748Z"
              fill="#DB4444"
            />
          </svg>
        </div>
      </div> */}
      {relatedProducts?.length > 0 && (
        <div className="related-items">
          <div className="section-header">
            <div className="section-label">
              <div className="rectangle"></div>
              <h2>{t("related_items_label")}</h2>
            </div>
          </div>
          <ProductRow products={relatedProducts} />
        </div>
      )}
    </section>
  );
}

export default ProductPage;
