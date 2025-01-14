import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function HomePageCategoriesMobile({ categories }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <Swiper
      className="home-page-categories-mobile"
      spaceBetween={5}
      slidesPerView={3}
      loop={categories?.length > 3}
      modules={[Navigation]}
      navigation
    >
      {categories.map((category, index) => (
        <SwiperSlide key={index}>
          <select
            onChange={(e) => {
              if (e.target.value) {
                navigate("/collection/" + e.target.value);
              }
            }}
          >
            <option value="" key={category.Name + "label"}>
              {i18n.language === "ur"
                ? "-- " + category.NameInUr + " --"
                : "-- " + category.Name + " --"}
            </option>
            {i18n.language === "ur" ? (
              <option value={category.Name} key={category.Name}>
                &#8592; {category.NameInUr}
              </option>
            ) : (
              <option value={category.Name} key={category.Name}>
                {category.Name} &#8594;
              </option>
            )}
            {i18n.language === "ur"
              ? category?.SubCategoriesInUr?.map((subCategoryUr) => (
                  <option value={subCategoryUr} key={subCategoryUr}>
                    &#8592; {subCategoryUr}
                  </option>
                ))
              : category?.SubCategories?.map((subCategory) => (
                  <option value={subCategory} key={subCategory}>
                    {subCategory} &#8594;
                  </option>
                ))}
          </select>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

HomePageCategoriesMobile.propTypes = {
  categories: PropTypes.array,
};

export default HomePageCategoriesMobile;
