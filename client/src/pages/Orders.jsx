import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import SignIn from "./SignIn";

function Orders() {
  const { t } = useTranslation();
  document.title = `${t("my_profile")} | shopwithfurqan`;
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const getOrders = useCallback(async () => {
    try {
      const token = cookies.get("token");
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      setCustomerName(token.customerName);
      setCustomerEmail(token.customerEmail);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/orders?email=${token.customerEmail}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders(data.ordersFound);
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  }, []);

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setIsAuthorized(true);
      getOrders();
    } else {
      setIsAuthorized(false);
    }
  }, [getOrders]);
  return (
    <>
      {!isAuthorized ? (
        <SignIn />
      ) : (
        <section className="order-section">
          <h1>
            {t("welcome")} <span>{customerName}</span>
          </h1>
          <div className="user-order-info">
            <div className="user-nav">
              <h2>{t("manage_acc")}</h2>
              <span>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {t("my_profile")}
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {t("my_orders")}
                </NavLink>
                <Link to="/wishlist">{t("wishlist")}</Link>
              </span>
            </div>
            <div className="user-orders">
              <h2>{t("my_orders")}</h2>
              <div className="order-table">
                <div className="order-table-header">
                  <span>#{t("order_no")}</span>
                  <span>{t("placed_on")}</span>
                  <span>{t("items")}</span>
                  <span>{t("total")}</span>
                  <span>{t("actions")}</span>
                </div>
                <div className="orders">
                  {orders.length === 0 && (
                    <div style={{ textAlign: "center" }}>
                      No Orders Found! Place One To See Here.
                    </div>
                  )}
                  {orders.map((order) => (
                    <div className="order" key={order.orderId}>
                      <span>{order.orderId}</span>
                      <span>
                        {new Date(order.createdAt).toISOString().split("T")[0]}
                      </span>
                      <span>{order.orderedItems?.length}</span>
                      <span>PKR  {order.totalAmount}</span>
                      <span className="order-action">
                        <a
                          href={`https://wa.me/+8801886556706/?text=Track+My+Order%0AOrder+No:+${order.orderId}%0AName:+${customerName}%0AEmail:+${customerEmail}`}
                          target="_blank"
                        >
                          {t("track_order")}
                        </a>
                        |
                        <a
                          href={`https://wa.me/+8801886556706/?text=Cancel+My+Order%0AOrder+No:+${order.orderId}%0AName:+${customerName}%0AEmail:+${customerEmail}`}
                          target="_blank"
                        >
                          {t("cancel")}
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Orders;
