import sideImage from "../assets/images/side-image.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function SignIn() {
  const { t } = useTranslation();
  document.title = t("Login") + " | Shopwithfurqan";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      const errorCodes = [404, 403, 400, 429, 500];
      if (errorCodes.includes(response.status)) {
        setValidationMessage(data.message);
        return;
      } else {
        setValidationMessage("");
      }
      if (data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error login user:", error);
    }
  };
  return (
    <section className="auth-section signUp">
      <div className="side-image">
        <img src={sideImage} alt="image with shopping tray" />
      </div>
      <div className="user-info">
        <h1>{t("Login_to_Shopwithfurqan")}</h1>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder={t("email")}
            autoComplete="true"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            placeholder={t("pass")}
            autoComplete="true"
            required
          />
          {validationMessage && (
            <span style={{ color: "red" }}>{validationMessage}</span>
          )}
          <div className="buttons">
            <button type="submit">{t("Login")}</button>
            <Link to="/recover">{t("forget_password")}</Link>
          </div>
        </form>
        <p>
          {t("no_account")} <Link to="/register">{t("sign_up")}</Link>
        </p>
      </div>
    </section>
  );
}

export default SignIn;
