import { Link } from "react-router-dom";
import { useContext } from "react";
import { SideFilterContext } from "../../contexts/SideFilterContext";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useState } from "react";

function SideFilter({
  brands,
  materials,
  collections,
  setByPriceRange,
  setByRating,
  setByBrand,
  setByMaterial,
  byRating,
  byMaterial,
  byPriceRange,
  byBrand,
  sortBy,
  collectionName,
}) {
  const { t } = useTranslation();
  const { isSideFilterOpen } = useContext(SideFilterContext);
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const handleRatingClick = (rating) => {
    setByRating(byRating === rating ? "" : rating);
  };
  const handleBrandToggle = (brand) => {
    setByBrand(byBrand === brand ? null : brand);
  };
  const handleMaterialToggle = (material) => {
    setByMaterial(byMaterial === material ? null : material);
  };
  return (
    <div
      className={`collection-page-left-side ${
        isSideFilterOpen ? "active" : ""
      }`}
    >
      <h1>{t("filters_heading")}</h1>
      <div className="line"></div>
      <div className="filter brand">
        <h2>{t("brand_heading")}</h2>
        <div className="line"></div>
        <div className="filter-group">
          {brands?.map((brand, index) => (
            <div key={brand + index}>
              <input
                type="checkbox"
                name={brand}
                id={brand}
                checked={byBrand === brand}
                onChange={() => handleBrandToggle(brand)}
              />
              <label htmlFor={brand}>{brand}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="filter price">
        <h2>Price</h2>
        <div className="line"></div>
        <div className="filter-group-price">
          <input
            type="number"
            name="min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="min"
          />{" "}
          -
          <input
            type="number"
            name="max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="max"
          />
          <button
            type="button"
            onClick={() => setByPriceRange(`${minPrice}-${maxPrice}`)}
          >
            {t("apply_btn")}
          </button>
        </div>
      </div>
      <div className="filter stars">
        <h2>{t("rating_heading")}</h2>
        <div className="line"></div>
        <div className="filter-group-stars">
          <Link
            to={`/collection/${collectionName}?sort_by=${sortBy}&brand=${byBrand}&rating=${byRating}&material=${byMaterial}&price_range=${byPriceRange}`}
            className={byRating === "5" ? "active" : ""}
            onClick={() => handleRatingClick("5")}
          >
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" defaultChecked />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" defaultChecked />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" defaultChecked />
              <label htmlFor="star1"></label>
            </div>
          </Link>
          <Link
            to={`/collection/${collectionName}?sort_by=${sortBy}&brand=${byBrand}&rating=${byRating}&material=${byMaterial}&price_range=${byPriceRange}`}
            className={byRating === "4" ? "active" : ""}
            onClick={() => handleRatingClick("4")}
          >
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" defaultChecked />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" defaultChecked />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
            <span>{t("and_up")}</span>
          </Link>
          <Link
            to={`/collection/${collectionName}?sort_by=${sortBy}&brand=${byBrand}&rating=${byRating}&material=${byMaterial}&price_range=${byPriceRange}`}
            className={byRating === "3" ? "active" : ""}
            onClick={() => handleRatingClick("3")}
          >
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" defaultChecked />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
            <span>{t("and_up")}</span>
          </Link>
          <Link
            to={`/collection/${collectionName}?sort_by=${sortBy}&brand=${byBrand}&rating=${byRating}&material=${byMaterial}&price_range=${byPriceRange}`}
            className={byRating === "2" ? "active" : ""}
            onClick={() => handleRatingClick("2")}
          >
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
            <span>{t("and_up")}</span>
          </Link>
          <Link
            to={`/collection/${collectionName}?sort_by=${sortBy}&brand=${byBrand}&rating=${byRating}&material=${byMaterial}&price_range=${byPriceRange}`}
            className={byRating === "1" ? "active" : ""}
            onClick={() => handleRatingClick("1")}
          >
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
            <span>{t("and_up")}</span>
          </Link>
        </div>
      </div>
      <div className="filter material">
        <h2>{t("material_heading")}</h2>
        <div className="line"></div>
        <div className="filter-group">
          {materials?.map((material, index) => (
            <div key={material + index}>
              <input
                type="checkbox"
                name={material}
                id={material}
                checked={byMaterial === material}
                onChange={() => handleMaterialToggle(material)}
              />
              <label htmlFor={material}>{material}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="filter categories">
        <h2>{t("categories_label")}</h2>
        <div className="line"></div>
        <div className="filter-group">
          {collections?.map((collection, index) => (
            <Link to={`/collection/${collection}`} key={collection + index}>
              {collection}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

SideFilter.propTypes = {
  materials: PropTypes.array,
  collections: PropTypes.array,
  brands: PropTypes.array,
  setByMaterial: PropTypes.any,
  setByBrand: PropTypes.any,
  setByPriceRange: PropTypes.any,
  setByRating: PropTypes.any,
  byRating: PropTypes.string,
  byMaterial: PropTypes.string,
  byPriceRange: PropTypes.string,
  byBrand: PropTypes.string,
  sortBy: PropTypes.string,
  collectionName: PropTypes.string,
};

export default SideFilter;
