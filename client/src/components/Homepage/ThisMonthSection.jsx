import PropTypes from "prop-types";
import ProductRow from "../ProductRow.jsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ThisMonthSection({ products }) {
  const { t } = useTranslation();
  return (
    <section className="this-month-section">
      <div className="section-header">
        <div className="section-label">
          <div className="rectangle"></div>
          <h2>{t("this_month_label")}</h2>
        </div>
        <div className="section-heading best-selling">
          <h3>{t("this_month_heading")}</h3>
          <div className="section-action">
            <Link to="/collection/bestselling">
              <button className="viewAll-btn">{t("view_all_btn")}</button>
            </Link>
          </div>
        </div>
      </div>
      <ProductRow products={products} />
    </section>
  );
}

ThisMonthSection.propTypes = {
  products: PropTypes.array,
};

export default ThisMonthSection;
