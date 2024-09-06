import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function NewArrivalSection({ products }) {
  const { t } = useTranslation();
  return (
    <section className="newArrival-section">
      <div className="section-header">
        <div className="section-label">
          <div className="rectangle"></div>
          <h2>{t("featured_label")}</h2>
        </div>
        <div className="section-heading new-arrival">
          <h3>{t("featured_heading")}</h3>
        </div>
      </div>
      <div className="section-body">
        <div className="first-column">
          <a href={products[0].Name}>
            <img src={products[0].Images} alt={products[0].Name} />
          </a>
        </div>
        <div className="second-column">
          <div className="row1-col2">
            <a href={products[1].Name}>
              <img src={products[1].Images} alt={products[1].Name} />
            </a>
          </div>
          <div className="row2-columns">
            <div className="row2-col2">
              <a href={products[2].Name}>
                <img src={products[2].Images} alt={products[2].Name} />
              </a>
            </div>
            <div className="row2-col3">
              <a href={products[3].Name}>
                <img src={products[3].Images} alt={products[3].Name} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

NewArrivalSection.propTypes = {
  products: PropTypes.array,
};

export default NewArrivalSection;
