import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function CategoriesSection({ categories }) {
  const { t, i18n } = useTranslation();
  return (
    <section className="categories-section">
      <div className="section-header">
        <div className="section-label">
          <div className="rectangle"></div>
          <h2>{t("categories_label")}</h2>
        </div>
        <div className="section-heading categories">
          <h3>{t("categories_heading")}</h3>
          <div className="section-action">
            <span className="collectionSlider-prev">
              <svg
                width="21"
                height="18"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1L1 8L8 15M1 8H17"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="collectionSlider-next">
              <svg
                width="21"
                height="18"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 8H18M18 8L11 1M18 8L11 15"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div>
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          modules={[Navigation]}
          navigation={{
            prevEl: ".collectionSlider-prev",
            nextEl: ".collectionSlider-next",
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.Name}>
              <div className="category">
                <img
                  src={category.Image}
                  alt={"Category " + category.Name + " image"}
                />
                <div className="category-button-wrapper">
                  <Link
                    to={"/collection/" + category.Name}
                    className="category-button"
                  >
                    {i18n.language === "ur" ? category.NameInUr : category.Name}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

CategoriesSection.propTypes = {
  categories: PropTypes.array,
};

export default CategoriesSection;
