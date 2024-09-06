import sideImage from "../assets/images/side-image.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function RecoverAccount() {
  const { t } = useTranslation();
  document.title = t("recover_acc") + " | shopwithfurqan";
  const [email, setEmail] = useState("");
  const [validationMessage, setValidationMessage] = useState(null);

  const handleRecover = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/recover`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      const errorCodes = [404, 400, 429, 500];
      if (errorCodes.includes(response.status)) {
        setValidationMessage({
          color: "red",
          message: data.message,
        });
        return;
      } else {
        setValidationMessage("");
      }
      if (response.status === 400) {
        setValidationMessage({
          color: "red",
          message: data.message,
        });
        return;
      } else {
        setValidationMessage(null);
      }
      if (data.success) {
        setValidationMessage({
          color: "green",
          message:
            "An email has been sent to your address with instructions to reset your password.",
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <section className="auth-section signUp">
      <div className="side-image">
        <img src={sideImage} alt="image with shopping tray" />
      </div>
      <div className="user-info">
        <h1>{t("reset_pass_heading")}</h1>
        <form onSubmit={handleRecover}>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder={t("email")}
            autoComplete="true"
            required
          />
          {validationMessage && (
            <span style={{ color: validationMessage.color }}>
              {validationMessage.message}
            </span>
          )}
          <button type="submit">{t("recover")}</button>
        </form>
        <p>
          {t("remember_pass")} <Link to="/login">{t("Login")}</Link>
        </p>
      </div>
    </section>
  );
}

export default RecoverAccount;
