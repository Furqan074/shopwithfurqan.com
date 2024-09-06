import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function HomePageCategories({ categories }) {
  const { i18n } = useTranslation();
  return (
    <div className="home-page-categories">
      <ul>
        {categories.slice(0, 9).map((category, index) => (
          <li key={index}>
            <Link to={"/collection/" + category.Name}>
              {i18n.language === "ur" ? category.NameInBn : category.Name}
            </Link>
            {category.SubCategories.length > 0 && (
              <>
                <ul>
                  <div>
                    {(i18n.language === "ur"
                      ? category.SubCategoriesInBn
                      : category.SubCategories
                    ).map((subCategory, index) => (
                      <li key={subCategory + index}>
                        <Link to={"/collection/" + subCategory}>
                          {subCategory}
                        </Link>
                      </li>
                    ))}
                  </div>
                </ul>
                <svg
                  width="8"
                  height="13"
                  viewBox="0 0 8 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.95 6.63597L0 1.68597L1.414 0.271973L7.778 6.63597L1.414 13L0 11.586L4.95 6.63597Z"
                    fill="black"
                  />
                </svg>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

HomePageCategories.propTypes = {
  categories: PropTypes.array,
};

export default HomePageCategories;
