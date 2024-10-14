import sideImage from "../assets/images/side-image.png";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function ResetPass() {
  const { t } = useTranslation();
  const { resetToken } = useParams();
  const navigate = useNavigate();
  document.title = t("reset_pass_heading") + " | Shopwithfurqan";
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleReset = async (event) => {
    event.preventDefault();
    if (confirmNewPassword !== newPassword) {
      setValidationMessage({
        color: "red",
        message: "Confirmation password did not match",
      });
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/reset/${resetToken}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
          }),
        }
      );

      const data = await response.json();
      const errorCodes = [404, 400, 500];
      if (errorCodes.includes(response.status)) {
        setValidationMessage({
          color: "red",
          message: data.message,
        });
        return;
      } else {
        setValidationMessage("");
      }
      if (data.success) {
        setValidationMessage({
          color: "green",
          message: data.message,
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error changing user password:", error);
    }
  };

  return (
    <section className="auth-section signUp">
      <div className="side-image">
        <img src={sideImage} alt="image with shopping tray" />
      </div>
      <div className="user-info">
        <h1>{t("reset_pass_heading")}</h1>
        <form onSubmit={handleReset}>
          {validationMessage && (
            <span style={{ color: validationMessage.color }}>
              {validationMessage.message}
            </span>
          )}
          <input
            type="password"
            id="new_password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            minLength={6}
            maxLength={12}
            placeholder={t("new_pass_placeholder")}
            autoCapitalize="new-password"
            required
          />
          <input
            type="password"
            id="confirm_password"
            value={confirmNewPassword}
            onChange={(e) => {
              setConfirmNewPassword(e.target.value);
            }}
            placeholder={t("confirm_new_pass_placeholder")}
            autoCapitalize="true"
            required={!!newPassword}
          />
          <button type="submit">{t("reset_pass_btn")}</button>
        </form>
        <p>
          {t("remember_pass")} <Link to="/login">{t("Login")}</Link>
        </p>
      </div>
    </section>
  );
}

export default ResetPass;
