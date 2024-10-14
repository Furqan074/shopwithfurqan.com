import { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function Drawer() {
  const { t } = useTranslation();
  const { closeCart, isCartOpen } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const loadCartItems = () => {
    const allCookies = cookies.getAll();
    const cartItemsArray = Object.keys(allCookies)
      .filter((key) => key.startsWith("cart"))
      .map((key) => allCookies[key]);
    setProducts(cartItemsArray);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => {
      return acc + item.productPrice * item.productQty;
    }, 0);
    setTotalPrice(total);
  };

  const handleRemoveItem = (productName) => {
    cookies.remove("cart" + productName, { path: "/" });
    loadCartItems();
  };

  const handleQtyChange = (productName, newQty) => {
    if (newQty < 1) return;

    const updatedProducts = products.map((item) =>
      item.productName === productName ? { ...item, productQty: newQty } : item
    );
    setProducts(updatedProducts);

    const cartItem = cookies.get("cart" + productName);
    if (cartItem) {
      cartItem.productQty = newQty;
      cookies.set("cart" + productName, cartItem, {
        maxAge: 172800,
        path: "/",
      });
    }
    calculateTotalPrice(updatedProducts);
  };

  useEffect(() => {
    if (isCartOpen) {
      loadCartItems();
    }
  }, [isCartOpen]);

  useEffect(() => {
    calculateTotalPrice(products);
  }, [products]);

  return (
    <div id="drawer" className={isCartOpen ? "active" : ""}>
      <div className="drawer-header">
        <div className="drawer-header-wrapper">
          <h2>{t("cart")}</h2>
          <svg
            onClick={closeCart}
            id="x-icon"
            title="Close this window"
            width="22"
            height="21"
            viewBox="0 0 22 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.5365 18.436C21.8316 18.7177 21.9974 19.0997 21.9974 19.498C21.9974 19.8964 21.8316 20.2784 21.5365 20.5601C21.2414 20.8418 20.8411 21 20.4238 21C20.0065 21 19.6062 20.8418 19.3111 20.5601L11 12.6247L2.68626 20.5576C2.39116 20.8393 1.99092 20.9975 1.57358 20.9975C1.15624 20.9975 0.755993 20.8393 0.46089 20.5576C0.165787 20.2759 4.39738e-09 19.8939 0 19.4955C-4.39738e-09 19.0972 0.165787 18.7152 0.46089 18.4335L8.77463 10.5006L0.463508 2.56526C0.168405 2.28359 0.00261814 1.90156 0.00261815 1.50321C0.00261815 1.10487 0.168405 0.722836 0.463508 0.441164C0.758611 0.159491 1.15886 0.00124926 1.5762 0.00124926C1.99353 0.00124925 2.39378 0.159491 2.68888 0.441164L11 8.37653L19.3137 0.439914C19.6088 0.158242 20.0091 -6.63643e-09 20.4264 0C20.8438 6.63643e-09 21.244 0.158242 21.5391 0.439914C21.8342 0.721586 22 1.10362 22 1.50196C22 1.90031 21.8342 2.28234 21.5391 2.56401L13.2254 10.5006L21.5365 18.436Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
      <div id="drawer-body">
        {products.length === 0 ? (
          <div className="empty-drawer-message">
            <span>{t("empty_cart")}</span>
          </div>
        ) : (
          <div id="drawer-item-wrapper">
            {products.map((item) => (
              <div className="drawer-item" key={item.productName}>
                <div className="item-media">
                  <Link to={`/products/${item.productName}`}>
                    {item?.productMedia?.includes("video") && (
                      <video autoPlay loop muted>
                        <source src={item.productMedia} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {item?.productMedia?.includes("image") && (
                      <img
                        src={item.productMedia}
                        alt={`${item.productName} Image`}
                      />
                    )}
                  </Link>
                </div>
                <div className="item-attributes">
                  <div className="item-name">
                    <Link to={`/products/${item.productName}`}>
                      <span>{item.productName}</span>
                    </Link>
                  </div>
                  <div className="item-price">
                    <span>PKR {item.productPrice}</span>
                  </div>
                  <div className="item-actions">
                    <div className="item-quantity-counter">
                      <button
                        className="qty qty-minus"
                        type="button"
                        onClick={() =>
                          handleQtyChange(item.productName, item.productQty - 1)
                        }
                      >
                        &minus;
                      </button>
                      <input
                        type="number"
                        name="qty"
                        value={item.productQty}
                        min="1"
                        inputMode="numeric"
                        onChange={(e) =>
                          handleQtyChange(
                            item.productName,
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <button
                        className="qty qty-plus"
                        type="button"
                        onClick={() =>
                          handleQtyChange(item.productName, item.productQty + 1)
                        }
                      >
                        &#43;
                      </button>
                    </div>
                    <div className="remove-item-button">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productName)}
                      >
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="drawer-footer">
        <Link to="/checkout">
          {products.length > 0 && (
            <button className="checkout-button">
              {t("checkout")} - PKR {totalPrice}
            </button>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Drawer;
