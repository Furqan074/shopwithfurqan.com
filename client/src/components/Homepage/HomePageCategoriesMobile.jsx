import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function HomePageCategoriesMobile({ categories }) {
  const { i18n } = useTranslation();
  return (
    <Swiper
      className="home-page-categories-mobile"
      spaceBetween={5}
      slidesPerView={4}
      loop={true}
      modules={[Navigation]}
      navigation
    >
      {categories.map((category, index) => (
        <SwiperSlide key={index}>
          <Link to={"/collection/" + category.Name}>
            {i18n.language === "ur" ? category.NameInUr : category.Name}
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

HomePageCategoriesMobile.propTypes = {
  categories: PropTypes.array,
};

export default HomePageCategoriesMobile;
