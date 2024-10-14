import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
          <Link to={`/products/${products[0].Name}`}>
            {products[0].Media[0].mediaType === "video" && (
              <video autoPlay loop muted>
                <source src={products[0].Media[0].source} />
                Your browser does not support the video tag.
              </video>
            )}
            {products[0].Media[0].mediaType === "image" && (
              <img
                src={products[0].Media[0].source}
                alt={`${products[0].Name} Image`}
              />
            )}
          </Link>
        </div>
        <div className="second-column">
          <div className="row1-col2">
            <Link to={`/products/${products[1].Name}`}>
              {products[1].Media[0].mediaType === "video" && (
                <video autoPlay loop muted>
                  <source src={products[1].Media[0].source} />
                  Your browser does not support the video tag.
                </video>
              )}
              {products[1].Media[0].mediaType === "image" && (
                <img
                  src={products[1].Media[0].source}
                  alt={`${products[1].Name} Image`}
                />
              )}{" "}
            </Link>
          </div>
          <div className="row2-columns">
            <div className="row2-col2">
              <Link to={`/products/${products[2].Name}`}>
                {products[2].Media[0].mediaType === "video" && (
                  <video autoPlay loop muted>
                    <source src={products[2].Media[0].source} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {products[2].Media[0].mediaType === "image" && (
                  <img
                    src={products[2].Media[0].source}
                    alt={`${products[2].Name} Image`}
                  />
                )}{" "}
              </Link>
            </div>
            <div className="row2-col3">
              <Link to={`/products/${products[3].Name}`}>
                {products[3].Media[0].mediaType === "video" && (
                  <video autoPlay loop muted>
                    <source src={products[3].Media[0].source} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {products[3].Media[0].mediaType === "image" && (
                  <img
                    src={products[3].Media[0].source}
                    alt={`${products[3].Name} Image`}
                  />
                )}{" "}
              </Link>
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
