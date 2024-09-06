import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useTranslation } from "react-i18next";

function AccountDropDown() {
  const { t } = useTranslation();
  const token = cookies.get("token");
  const handleLogOut = async () => {
    try {
      cookies.remove("token", {
        domain: import.meta.env.MODE === "production" ? "shopwithfurqan.com" : "",
        path: "/",
      });
    } catch (error) {
      console.log("error during logout", error);
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <li className="account-dropdown-authorized">
      <svg
        width="26"
        height="26"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.75"
          y="0.75"
          width="21.5"
          height="21.5"
          rx="10.75"
          stroke="black"
          strokeWidth="1.5"
        />
        <path
          d="M15.0938 16.5312V15.3333C15.0938 14.6979 14.8716 14.0885 14.4762 13.6392C14.0808 13.1899 13.5446 12.9375 12.9854 12.9375H9.29583C8.73667 12.9375 8.20041 13.1899 7.80502 13.6392C7.40963 14.0885 7.1875 14.6979 7.1875 15.3333V16.5312"
          stroke="black"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 10.7812C12.6909 10.7812 13.6562 9.81586 13.6562 8.625C13.6562 7.43414 12.6909 6.46875 11.5 6.46875C10.3091 6.46875 9.34375 7.43414 9.34375 8.625C9.34375 9.81586 10.3091 10.7812 11.5 10.7812Z"
          stroke="black"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <span className="customer-name">{token.customerName}</span>
        <span>{t("orders_acc_label")}</span>
      </div>
      <div className="account-dropdown">
        <ul>
          <li>
            <Link to="/profile">
              <svg
                width="20"
                height="23"
                viewBox="0 0 20 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0001 9.59093C12.6316 9.59093 14.7648 7.66778 14.7648 5.29546C14.7648 2.92314 12.6316 1 10.0001 1C7.3686 1 5.23535 2.92314 5.23535 5.29546C5.23535 7.66778 7.3686 9.59093 10.0001 9.59093Z"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.0001 22.2272V19.6817C19.0001 18.3315 18.4944 17.0367 17.5942 16.0819C16.694 15.1272 15.4731 14.5908 14.2001 14.5908H5.80003C4.52699 14.5908 3.30608 15.1272 2.4059 16.0819C1.50572 17.0367 1 18.3315 1 19.6817V22.2272"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("manage_acc")}
            </Link>
          </li>
          <li>
            <Link to="/orders">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6.3V20.5C3 20.7652 3.10536 21.0196 3.29289 21.2071C3.48043 21.3946 3.73478 21.5 4 21.5H20C20.2652 21.5 20.5196 21.3946 20.7071 21.2071C20.8946 21.0196 21 20.7652 21 20.5V6.3H3Z"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 6.3L18.1665 2.5H5.8335L3 6.3M15.7775 9.6C15.7775 11.699 14.0865 13.4 12 13.4C9.9135 13.4 8.222 11.699 8.222 9.6"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("my_orders")}
            </Link>
          </li>
          <li onClick={handleLogOut}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12H13.5M6 15L3 12L6 9M11 7V6C11 5.46957 11.2107 4.96086 11.5858 4.58579C11.9609 4.21071 12.4696 4 13 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H13C12.4696 20 11.9609 19.7893 11.5858 19.4142C11.2107 19.0391 11 18.5304 11 18V17"
                stroke="#FAFAFA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("logout")}
          </li>
        </ul>
      </div>
    </li>
  );
}

export default AccountDropDown;
