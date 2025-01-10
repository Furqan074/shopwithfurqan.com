import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import PageNotFound from "./PageNotFound";

const removeCookiesWithPrefix = (prefixes) => {
  const allCookies = cookies.getAll();
  Object.keys(allCookies).forEach((key) => {
    for (const prefix of prefixes) {
      if (key.startsWith(prefix)) {
        cookies.remove(key, { path: "/" });
      }
    }
  });
};

function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isUser = cookies.get("token");
  document.title = `${t("checkout")} | Shopwithfurqan`;
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [firstName, setFirstName] = useState(
    isUser?.customerName?.split(" ")[0]
  );
  const [lastName, setLastName] = useState(isUser?.customerName?.split(" ")[1]);
  const [email, setEmail] = useState(isUser?.customerEmail);
  const [phone, setPhone] = useState(isUser?.customerPhone);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState(isUser?.customerAddress);
  const [apartment, setApartment] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");
  const [unExpectedError, setUnexpectedError] = useState("");
  const handleCheckout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            email: email.trim(),
            phone,
            address: `${address.trim()}, ${apartment}, ${city}, Pakistan`,
            items: checkoutProducts,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.status === 404) {
        setEmailValidationError(data.message);
        return;
      } else if (data.status === 500) {
        setUnexpectedError("Unexpected Error");
        setEmailValidationError("");
      } else {
        setUnexpectedError("");
        setEmailValidationError("");
      }

      if (data.success) {
        cookies.set("checkoutSuccess", true, { path: "/", maxAge: 60 });
        navigate("/confirmation");
        document.getElementById("cart-count").style.display = "none";
        removeCookiesWithPrefix(["buyNow", "cart"]);
      }
    } catch (error) {
      console.error("Error at Checkout:", error);
    }
  };

  const loadCheckoutItems = () => {
    const allCookies = cookies.getAll();
    const checkoutItemsArray = Object.keys(allCookies)
      .filter((key) => key.startsWith("cart"))
      .map((key) => allCookies[key]);
    setCheckoutProducts(checkoutItemsArray);
  };

  const calculateTotalPrice = (items) => {
    let shipping = 0;
    const total = items.reduce((acc, item) => {
      item.productShippingFee > 0 ? (shipping = item.productShippingFee) : 0;
      setShippingFee(shipping);
      return acc + item?.productPrice * item?.productQty;
    }, 0);
    if (total > 1500) {
      shipping = 0;
      setShippingFee(0);
    }
    setTotalPrice(total + shipping);
  };

  useEffect(() => {
    loadCheckoutItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice(checkoutProducts);
  }, [checkoutProducts]);

  if (checkoutProducts.length === 0 || checkoutProducts[0] === undefined)
    return <PageNotFound />;

  return (
    <section className="checkout-section">
      <h1>{t("billing_details")}</h1>
      <div className="checkout">
        <form
          className="billing_details"
          id="checkout-form"
          onSubmit={handleCheckout}
        >
          <span>
            <label htmlFor="firstName" className="required">
              {t("f_name")}
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="true"
              required
            />
          </span>
          <span>
            <label htmlFor="lastName" className="required">
              {t("l_name")}
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="true"
              required
            />
          </span>
          <span>
            <label htmlFor="email" className="required">
              {t("email") + " " + t("address_label")}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="true"
              required
            />
            {emailValidationError && (
              <span style={{ color: "red" }}>{emailValidationError}</span>
            )}
          </span>
          <span>
            <label htmlFor="phone" className="required">
              {t("phone_number_label")}
            </label>
            <input
              type="number"
              id="phone"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="true"
              required
            />
          </span>
          <span>
            <label htmlFor="country">{t("country_label")}</label>
            <select>
              <option value="pk">Pakistan</option>
            </select>
          </span>
          <span>
            <label htmlFor="city" className="required">
              {t("town_city_label")}
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="true"
              required
            />
          </span>
          <span>
            <label htmlFor="address" className="required">
              {t("street_address_label")}
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="true"
              required
            />
          </span>
          <span>
            <label htmlFor="apartment">{t("apartment_label")}</label>
            <input
              type="text"
              id="apartment"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              autoComplete="true"
            />
          </span>
        </form>
        <div className="order_summary">
          <div className="order-summary-items">
            {checkoutProducts?.map((item) => (
              <div className="item" key={item?.cookieName}>
                <Link to={`/products/${item?.productName}`}>
                  {item?.productMedia.includes("video") && (
                    <video autoPlay loop muted>
                      <source src={item?.productMedia} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {item?.productMedia.includes("image") && (
                    <img
                      src={item?.productMedia}
                      alt={`${item?.productName} Image`}
                    />
                  )}
                </Link>{" "}
                <div className="item-info">
                  <Link to={`/products/${item?.productName}`}>
                    {item?.productName}
                  </Link>
                  <span>{item?.productQty}</span>
                  <span>{item?.productSize}</span>
                  <span>{item?.productColor}</span>
                  <span>PKR {item?.productPrice}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="underline">
            <span>{t("subtotal")}:</span>
            <span>PKR {totalPrice - shippingFee}</span>
          </div>
          <div className="underline">
            <span>{t("shipping")}:</span>
            <span>{shippingFee ? `PKR ${shippingFee}` : "Free"}</span>
          </div>
          <div className="total">
            <span>{t("total")}:</span>
            <span>PKR {totalPrice}</span>
          </div>
          <div className="payment-type">
            <input type="radio" id="COD" defaultChecked />
            <label htmlFor="COD">{t("COD")}</label>
          </div>
          <button type="submit" form="checkout-form">
            {t("place_order")}
          </button>
          {unExpectedError && (
            <div style={{ color: "red" }}>{unExpectedError}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Checkout;
