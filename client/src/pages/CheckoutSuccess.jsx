import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import PageNotFound from "./PageNotFound";
import successAnimation from "../assets/images/success-animation.gif";

const cookies = new Cookies();

function CheckoutSuccess() {
  document.title = "Thank you for your purchase | Shopwithfurqan";
  const [isCheckoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const checkoutSuccess = cookies.get("checkoutSuccess");
    if (checkoutSuccess) {
      cookies.remove("checkoutSuccess", { path: "/" });
      setCheckoutSuccess(true);
    }
  }, []);

  return (
    <>
      {!isCheckoutSuccess ? (
        <PageNotFound />
      ) : (
        <section style={{ textAlign: "center", paddingBottom: "60px" }}>
          <div>
            <img
              src={successAnimation}
              alt="success green tick party animation"
            />
          </div>
          <h1
            style={{
              fontSize: "2em",
              color: "var(--primary-color)",
              fontWeight: "500",
            }}
          >
            Thanks For Your Purchase.
          </h1>
          <h2 style={{ fontSize: "1.3em", fontWeight: "500" }}>
            Your order is placed successfully One of our moderators will contact
            with you for confirmation!
          </h2>
          <Link to="/orders">
            <button
              style={{
                border: "none",
                fontFamily: "Poppins",
                width: "200px",
                padding: "10px",
                color: "#fff",
                marginTop: "10px",
                backgroundColor: "var(--primary-color)",
                fontSize: "1em",
                cursor: "pointer",
                textDecoration: "none",
                position: "relative",
                borderRadius: "4px",
              }}
            >
              See Order Details
            </button>
          </Link>
        </section>
      )}
    </>
  );
}

export default CheckoutSuccess;
