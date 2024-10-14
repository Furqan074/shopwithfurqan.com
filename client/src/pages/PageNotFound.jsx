import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PageNotFound() {
  const { t } = useTranslation();
  document.title = `${t("not_found_heading")} | Shopwithfurqan`;
  return (
    <section className="pageNotFound-section">
      <h1>{t("not_found_heading")}</h1>
      <p>{t("not_found_message")}</p>
      <Link to="/">
        <button>{t("go_back_home")}</button>
      </Link>
    </section>
  );
}

export default PageNotFound;
