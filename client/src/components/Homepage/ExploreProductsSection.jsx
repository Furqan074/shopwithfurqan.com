import PropTypes from "prop-types";
import ProductRow from "../ProductRow.jsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ExploreProductsSection({ products }) {
  const { t } = useTranslation();
  return (
    <section className="explore-products-section">
      <div className="section-header">
        <div className="section-label">
          <div className="rectangle"></div>
          <h2>{t("Our_Products_label")}</h2>
        </div>
        <div className="section-heading exploreProducts">
          <h3>{t("Our_Products_heading")}</h3>
          <div className="section-action">
            <Link to="/collection/explore">
              <button className="viewAll-btn">{t("view_all_btn")}</button>
            </Link>
          </div>
        </div>
      </div>
      <ProductRow products={products} />
    </section>
  );
}

ExploreProductsSection.propTypes = {
  products: PropTypes.array,
};

export default ExploreProductsSection;
