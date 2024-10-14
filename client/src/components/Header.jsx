import logo from "/src/assets/images/logo.png";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CartContext } from "../contexts/CartContext";
import { WishlistContext } from "../contexts/WishlistContext";
import AccountDropDown from "./AccountDropDown";
import ProductRow from "../components/ProductRow";
import Cookies from "universal-cookie";
import { debounce } from "lodash";
const cookies = new Cookies();

function Header() {
  const { isCartOpen, openCart, closeCart } = useContext(CartContext);
  const { wishCount } = useContext(WishlistContext);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const { t, i18n } = useTranslation();

  const closeSearch = () => {
    setSearchTerm("");
    fetchSuggestions("");
    setProducts([]);
  };

  const debouncedFetchSuggestions = debounce(async (query) => {
    setProducts([]);
    if (!query) {
      setProducts([]);
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/search?query=${query}`
      );
      const data = await response.json();
      setProducts(data.results);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, 300);

  const fetchSuggestions = useCallback(
    (query) => {
      debouncedFetchSuggestions(query);
    },
    [debouncedFetchSuggestions]
  );

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    fetchSuggestions(query);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  const loadCartCount = () => {
    const allCookies = cookies.getAll();
    const cartItemsArray = Object.keys(allCookies)
      .filter((key) => key.startsWith("cart"))
      .map((key) => allCookies[key].productQty);
    setCartCount(cartItemsArray.reduce((partialSum, a) => partialSum + a, 0));
  };

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    if (isCartOpen || closeCart) {
      loadCartCount();
    }
  }, [isCartOpen, closeCart]);

  return (
    <header className="header-desktop">
      <div
        className={`page-overlay ${isCartOpen ? "active" : ""}`}
        onClick={closeCart}
      ></div>
      <nav>
        <ul>
          <li className="logo">
            <Link to="/">
              <img src={logo} alt="Shopwithfurqan logo" />
            </Link>
          </li>
          <li className="searchBar">
            <input
              type="text"
              role="search"
              name="search"
              id="search"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm ? (
              <svg
                onClick={closeSearch}
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
            ) : (
              <svg
                width="14.272278"
                height="14.136230"
                viewBox="0 0 14.2723 14.1362"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="Vector"
                  d="M6.34 0C5.33 0 4.33 0.23 3.43 0.69C2.53 1.15 1.76 1.82 1.17 2.64C0.58 3.45 0.2 4.4 0.06 5.39C-0.08 6.38 0.01 7.4 0.35 8.34C0.68 9.29 1.23 10.15 1.97 10.84C2.7 11.53 3.59 12.04 4.56 12.32C5.53 12.6 6.56 12.65 7.55 12.46C8.55 12.27 9.48 11.84 10.27 11.22L13 13.92C13.14 14.06 13.33 14.13 13.53 14.13C13.72 14.13 13.91 14.05 14.05 13.91C14.19 13.78 14.27 13.59 14.27 13.4C14.27 13.2 14.19 13.02 14.06 12.88L11.33 10.18C12.07 9.25 12.53 8.13 12.66 6.96C12.78 5.79 12.58 4.6 12.06 3.54C11.54 2.48 10.72 1.58 9.71 0.95C8.7 0.33 7.54 0 6.34 0ZM1.49 6.28C1.49 5.01 2 3.78 2.91 2.88C3.82 1.98 5.06 1.47 6.34 1.47C7.63 1.47 8.87 1.98 9.78 2.88C10.69 3.78 11.2 5.01 11.2 6.28C11.2 7.56 10.69 8.78 9.78 9.68C8.87 10.59 7.63 11.09 6.34 11.09C5.06 11.09 3.82 10.59 2.91 9.68C2 8.78 1.49 7.56 1.49 6.28Z"
                  fill="#000000"
                />
              </svg>
            )}
          </li>
          {isAuthorized ? (
            <AccountDropDown />
          ) : (
            <li className="links">
              <Link to="login">{t("sign_in")}</Link>|
              <Link to="register">{t("sign_up")}</Link>
            </li>
          )}
          <li className="lang-selector">
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 0C8.82441 0 6.69767 0.679008 4.88873 1.95116C3.07979 3.22331 1.66989 5.03147 0.83733 7.14698C0.00476594 9.26249 -0.21307 11.5903 0.211367 13.8361C0.635804 16.082 1.68345 18.1449 3.22183 19.764C4.76021 21.3832 6.72022 22.4858 8.85401 22.9325C10.9878 23.3792 13.1995 23.15 15.2095 22.2737C17.2195 21.3974 18.9375 19.9135 20.1462 18.0096C21.3549 16.1057 22 13.8673 22 11.5775C21.9966 8.50806 20.8365 5.56537 18.7744 3.39495C16.7122 1.22453 13.9163 0.00360474 11 0ZM19.7968 7.26431H15.4421C14.9229 5.15868 13.9762 3.19653 12.6673 1.51302C14.207 1.79878 15.6588 2.4706 16.8998 3.47167C18.1408 4.47275 19.1344 5.77363 19.7968 7.26431ZM20.7059 11.5775C20.7066 12.5772 20.5674 13.5716 20.2928 14.5286H15.7246C16.0396 12.5752 16.0396 10.5798 15.7246 8.62637H20.2928C20.5674 9.5834 20.7066 10.5778 20.7059 11.5775ZM11 21.5466C10.377 20.8777 9.8275 20.1372 9.36187 19.339C8.73345 18.2631 8.24522 17.1033 7.9103 15.8907H14.0897C13.7548 17.1033 13.2666 18.2631 12.6381 19.339C12.1725 20.1372 11.623 20.8777 11 21.5466ZM7.59755 14.5286C7.24531 12.5787 7.24531 10.5763 7.59755 8.62637H14.4025C14.7547 10.5763 14.7547 12.5787 14.4025 14.5286H7.59755ZM1.29412 11.5775C1.2934 10.5778 1.43257 9.5834 1.70716 8.62637H6.2754C5.96043 10.5798 5.96043 12.5752 6.2754 14.5286H1.70716C1.43257 13.5716 1.2934 12.5772 1.29412 11.5775ZM11 1.60836C11.623 2.27725 12.1725 3.0178 12.6381 3.81603C13.2666 4.89184 13.7548 6.05164 14.0897 7.26431H7.9103C8.24522 6.05164 8.73345 4.89184 9.36187 3.81603C9.8275 3.0178 10.377 2.27725 11 1.60836ZM9.33275 1.51302C8.02378 3.19653 7.07711 5.15868 6.55794 7.26431H2.20324C2.86558 5.77363 3.85925 4.47275 5.10022 3.47167C6.34119 2.4706 7.79296 1.79878 9.33275 1.51302ZM2.20324 15.8907H6.55794C7.07711 17.9963 8.02378 19.9585 9.33275 21.642C7.79296 21.3562 6.34119 20.6844 5.10022 19.6833C3.85925 18.6822 2.86558 17.3814 2.20324 15.8907ZM12.664 21.642C13.9741 19.9588 14.9219 17.9966 15.4421 15.8907H19.7968C19.1344 17.3814 18.1408 18.6822 16.8998 19.6833C15.6588 20.6844 14.207 21.3562 12.6673 21.642H12.664Z"
                fill="black"
              />
            </svg>
            <select
              id="lang"
              value={i18n.language}
              onChange={handleLanguageChange}
            >
              <option value="en">EN</option>
              <option value="ur">UR</option>
            </select>
          </li>
          <li>
            <Link to="wishlist" className="wish-page">
              {wishCount > 0 && <span id="wish-count">{wishCount}</span>}
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
                  strokeWidth="1.5"
                />
              </svg>
            </Link>
          </li>
          <li className="cart" onClick={openCart}>
            {cartCount > 0 && <span id="cart-count">{cartCount}</span>}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z"
                stroke="black"
                strokeWidth="1.5"
              />
              <path
                d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z"
                stroke="black"
                strokeWidth="1.5"
              />
              <path d="M3 5H7L10 22H26" stroke="black" strokeWidth="1.5" />
              <path
                d="M10 16.6667H25.59C25.7056 16.6668 25.8177 16.6268 25.9072 16.5536C25.9966 16.4803 26.0579 16.3783 26.0806 16.2649L27.8806 7.26487C27.8951 7.1923 27.8934 7.11741 27.8755 7.0456C27.8575 6.9738 27.8239 6.90687 27.7769 6.84965C27.73 6.79242 27.6709 6.74633 27.604 6.7147C27.5371 6.68308 27.464 6.6667 27.39 6.66675H8"
                stroke="black"
                strokeWidth="1.5"
              />
            </svg>
          </li>
        </ul>
      </nav>
      {products.length > 0 ? (
        <div className="search-results">
          <div
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.6)",
            }}
          >
            Results: {products.length}
          </div>
          <ProductRow products={products} />
        </div>
      ) : searchTerm && products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
          }}
        >
          No Items found
        </div>
      ) : (
        ""
      )}
    </header>
  );
}

export default Header;
