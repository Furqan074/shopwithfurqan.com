import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function WishPage() {
  const { t } = useTranslation();
  document.title = `${t("wishlist")} | shopwithfurqan`;
  const { setWishCount } = useContext(WishlistContext);
  const { openCart } = useContext(CartContext);
  const [wishItems, setWishItems] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const handleCartMove = () => {
    wishItems.forEach((item) => {
      addToCart(item);
    });
    openCart();
    clearWishlist();
  };

  const handleSingleCartMove = (item) => {
    addToCart(item);
    setWishCount((prev) => prev - 1);
    openCart();
    removeFromWishlist(item.name);
  };
  // FIXME get OUT the functionality 

  const addToCart = (item) => {
    cookies.set(
      "cart" + item.name,
      {
        productName: item.name,
        productImage: item.image,
        productPrice: item.price,
        productQty: 1,
      },
      {
        maxAge: 172800, // 2 days
        sameSite: true,
        secure: true,
        path: "/",
      }
    );
  };

  const removeFromWishlist = (name) => {
    const updatedWishItems = wishItems.filter((item) => item.name !== name);
    setWishItems(updatedWishItems);
    setWishCount(updatedWishItems.length);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishItems));
  };

  const clearWishlist = () => {
    setWishItems([]);
    localStorage.removeItem("wishlist");
    setWishCount(0);
  };

  return (
    <section className="wishlist-section">
      <div className="wishlist-header">
        <div className="wish-heading">
          <h1>
            {t("wishlist")} ({wishItems.length})
          </h1>
        </div>
        <div className="wish-action">
          {wishItems.length !== 0 && (
            <button onClick={handleCartMove}>{t("move_to_cart")}</button>
          )}
        </div>
      </div>
      {wishItems.length === 0 ? (
        <div className="empty-wishlist-message">
          <span>{t("empty_wishlist")}</span>
        </div>
      ) : (
        <div className="wishlist-body">
          {wishItems.map((item) => (
            <div className="wish-card" key={item.name}>
              <div className="wish-card-image">
                <Link to={`/products/${item.name}`}>
                  <img src={item.image} alt={item.name} />
                </Link>
                <span
                  className="remove-wishItem-btn"
                  onClick={() => removeFromWishlist(item.name)}
                >
                  <svg
                    width="19"
                    height="20"
                    viewBox="0 0 19 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.2402 3.57143H2.57357L3.9069 19H14.5736L15.9069 3.57143H1.24023M9.24023 7.42857V15.1429M12.5736 7.42857L11.9069 15.1429M5.9069 7.42857L6.57357 15.1429M6.57357 3.57143L7.24023 1H11.2402L11.9069 3.57143"
                      stroke="black"
                      strokeWidth="1.56"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <button
                  onClick={() => handleSingleCartMove(item)}
                  className="addToCart-btn"
                >
                  {t("Add_To_Cart")}
                </button>
              </div>
              <div className="wish-info">
                <div className="wish-card-name">
                  <Link to={`/products/${item.name}`}>{item.name}</Link>
                </div>
                <div className="wish-card-prices">
                  <div className="wish-card-current-price">
                    PKR {item.price}
                  </div>
                  {item.discountedPrice && (
                    <div className="wish-card-previous-price">
                      PKR {item.discountedPrice}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WishPage;
