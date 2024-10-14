import sideImage from "../assets/images/side-image.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function SignUp() {
  const { t } = useTranslation();
  document.title = t("Create_account") + " | Shopwithfurqan";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidationMessage, setPasswordValidationMessage] =
    useState("");
  const [emailValidationMessage, setEmailValidationMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidationMessage("Please enter a valid email");
      return;
    } else {
      setEmailValidationMessage("");
    }
    if (password.length < 6) {
      setPasswordValidationMessage("Password should be 6 characters long");
      return;
    } else {
      setPasswordValidationMessage("");
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
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
      console.error("Error registering user:", error);
    }
  };

  return (
    <section className="auth-section signUp">
      <div className="side-image">
        <img src={sideImage} alt="image with shopping tray" />
      </div>
      <div className="user-info">
        <h1>{t("Create_an_account")}</h1>
        <form onSubmit={handleSignUp}>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name")}
              autoComplete="true"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              autoComplete="true"
              required
            />
            {emailValidationMessage && (
              <span style={{ color: "red" }}>{emailValidationMessage}</span>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("pass")}
              autoComplete="true"
              required
            />
            {passwordValidationMessage && (
              <span style={{ color: "red" }}>{passwordValidationMessage}</span>
            )}
          </div>
          {validationMessage && (
            <span style={{ color: "red" }}>{validationMessage}</span>
          )}
          <button type="submit">{t("Create_account")}</button>
        </form>
        <p>
          {t("have_account")} <Link to="/login">{t("Login")}</Link>
        </p>
      </div>
    </section>
  );
}

export default SignUp;
