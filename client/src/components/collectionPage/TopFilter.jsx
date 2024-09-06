import { useContext } from "react";
import { SideFilterContext } from "../../contexts/SideFilterContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function TopFilter({ qty, collectionName, setSortBy }) {
  const { t } = useTranslation();
  const { isSideFilterOpen, closeSideFilter, openSideFilter } =
    useContext(SideFilterContext);

  return (
    <div className="collection-page-filter-top">
      <div
        className={`page-overlay ${isSideFilterOpen ? "active" : ""}`}
        onClick={closeSideFilter}
      ></div>
      <div className="results-found">
        {qty || "No"} {t("items_found")}{" "}
        <span>&quot;{collectionName}&quot;</span>
      </div>
      <div className="filter-top-sort">
        <span>{t("sort_by_label")}: </span>
        <div>
          {t("new_in_label")}
          <svg
            width="12.728027"
            height="7.778076"
            viewBox="0 0 12.728 7.77808"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="Vector"
              d="M6.36 4.94L11.31 0L12.72 1.41L6.36 7.77L0 1.41L1.41 0L6.36 4.94Z"
              fill="#000000"
              fillOpacity="0.800000"
              fillRule="nonzero"
            />
          </svg>
          <div className="sort-dropdown">
            <div>
              <Link
                to={`/collection/${collectionName}?sort_by=new`}
                onClick={() => setSortBy("new")}
              >
                {t("new_in_label")}
              </Link>
              <Link
                to={`/collection/${collectionName}?sort_by=sale`}
                onClick={() => setSortBy("sale")}
              >
                {t("on_sale_label")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="filter-top-view">
        {/* TODO Temporary excluding this feature because of time shortage */}
        {/* <span>View:</span>
        <svg
          width="18.000000"
          height="18.000000"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
          className="active"
        >
          <path
            id="Vector"
            d="M0 7.5L0 0L7.5 0L7.5 7.5L0 7.5ZM0 18L0 10.5L7.5 10.5L7.5 18L0 18ZM10.5 7.5L10.5 0L18 0L18 7.5L10.5 7.5ZM10.5 18L10.5 10.5L18 10.5L18 18L10.5 18Z"
            fillOpacity="1.000000"
            fillRule="nonzero"
          />
        </svg>
        <svg
          width="20.000000"
          height="16.000000"
          viewBox="0 0 20 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="Vector"
            d="M7 16L18 16C18.54 16 19.02 15.8 19.41 15.41C19.8 15.02 20 14.55 20 14L20 12L7 12L7 16ZM0 4L5 4L5 0L2 0C1.45 0 0.97 0.19 0.58 0.58C0.19 0.97 0 1.45 0 2L0 4ZM0 10L5 10L5 6L0 6L0 10ZM2 16L5 16L5 12L0 12L0 14C0 14.55 0.19 15.02 0.58 15.41C0.97 15.8 1.45 16 2 16ZM7 10L20 10L20 6L7 6L7 10ZM7 4L20 4L20 2C20 1.44 19.8 0.97 19.41 0.58C19.02 0.19 18.55 0 18 0L7 0L7 4Z"
            fillOpacity="1.000000"
            fillRule="nonzero"
          />
        </svg> */}
        <svg
          onClick={openSideFilter}
          width="24.000000"
          height="24.000000"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="path"
            d="M10.2 12.9L10.2 19.22L13.8 21L13.8 12.9L21 4.5L3 4.5L10.2 12.9Z"
            stroke="#000"
            fill="transparent"
            strokeOpacity="1.000000"
            strokeWidth="1.500000"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

TopFilter.propTypes = {
  qty: PropTypes.any,
  collectionName: PropTypes.string,
  setSortBy: PropTypes.any,
};

export default TopFilter;
