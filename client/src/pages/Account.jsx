import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import SignIn from "./SignIn";

function Account() {
  const { t } = useTranslation();
  document.title = `${t("my_profile")} | Shopwithfurqan`;
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPopupActive, setPopupActive] = useState(false);
  const [popupValidation, setPopupValidation] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setIsAuthorized(true);
      setOldEmail(token.customerEmail || "");
      setNewEmail(token.customerEmail || "");
      const names = token.customerName ? token.customerName.split(" ") : [];
      setFirstName(names[0] || "");
      setLastName(names[1] || "");
      setPhone(token.customerPhone || "");
      setAddress(token.customerAddress || "");
      setWelcomeName(names[0] || "");
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setPopupActive(true);
      setPopupValidation({
        type: "alert",
        message: "Please enter a valid email",
      });
      return;
    } else if (confirmNewPassword !== newPassword) {
      setPopupActive(true);
      setPopupValidation({
        type: "alert",
        message: "Confirmation password did not match",
      });
      return;
    }
    try {
      const token = cookies.get("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`.trim(),
            newEmail: newEmail.trim(),
            oldEmail,
            phone,
            address: address.trim(),
            oldPassword,
            newPassword,
            confirmNewPassword,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      const errorCodes = [404, 403, 400, 429, 500];
      if (errorCodes.includes(response.status)) {
        setPopupActive(true);
        setPopupValidation({
          type: "error",
          message: data.message,
        });
        return;
      } else {
        setPopupActive(false);
        setPopupValidation("");
      }

      if (data.success) {
        setPopupActive(true);
        setWelcomeName(firstName);
        setPopupValidation({
          type: "success",
          message: "Data Updated Successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };
  return (
    <>
      {!isAuthorized ? (
        <SignIn />
      ) : (
        <section className="account-section">
          <div className={`popup-wrapper ${isPopupActive ? "active" : ""}`}>
            <div className={`popup ${popupValidation.type}-popup`}>
              <div className={`${popupValidation.type}-message`}>
                {popupValidation.message}
              </div>
              <div
                className="popup-icon close-icon"
                onClick={() => setPopupActive(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="close-svg"
                >
                  <path
                    d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"
                    className="close-path"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <h1>
            {t("welcome")} <span>{welcomeName}</span>
          </h1>
          <div className="user-info">
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
            <div className="edit-user-info">
              <h2>{t("edit_profile")}</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="input-wrapper_1">
                  <span>
                    <label htmlFor="firstName">{t("f_name")}</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder={t("f_name")}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="true"
                      required
                    />
                  </span>
                  <span>
                    <label htmlFor="lastName">{t("l_name")}</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder={t("l_name")}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="true"
                    />
                  </span>
                </div>
                <div className="input-wrapper_2">
                  <div>
                    <span>
                      <label htmlFor="email">{t("email")}</label>
                      <input
                        type="email"
                        id="email"
                        placeholder={t("your") + t("email")}
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        autoComplete="true"
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="phone">{t("phone_label")}</label>
                      <input
                        type="number"
                        id="phone"
                        placeholder={t("your") + t("phone_label")}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="true"
                        inputMode="numeric"
                      />
                    </span>
                  </div>
                  <span>
                    <label htmlFor="address">{t("address_label")}</label>
                    <input
                      type="text"
                      id="address"
                      placeholder={t("your") + t("address_label")}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      autoComplete="true"
                    />
                  </span>
                </div>
                <div className="input-wrapper_3">
                  <span>
                    <label htmlFor="old_password">
                      {t("pass_changes_label")}
                    </label>
                    <input
                      type="password"
                      id="old_password"
                      placeholder={t("current_pass_placeholder")}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      autoComplete="true"
                    />
                    <input
                      type="password"
                      placeholder={t("new_pass_placeholder")}
                      minLength={6}
                      maxLength={12}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      required={!!oldPassword}
                    />
                    <input
                      type="password"
                      placeholder={t("confirm_new_pass_placeholder")}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      autoComplete="true"
                      required={!!newPassword}
                    />
                  </span>
                </div>
                <div className="form-action">
                  <button type="submit">{t("save_changes_btn")}</button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Account;
