import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

function Banner() {
  const [banners, setBanners] = useState([]);
  const getAllBanners = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/banners`
      );
      const data = await response.json();
      if (data.success) {
        setBanners(data.allBanners);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Error Getting Banner:", error);
      setBanners([]);
    }
  }, []);

  useEffect(() => {
    getAllBanners();
  }, [getAllBanners]);

  return (
    <Swiper
      className="banner"
      spaceBetween={50}
      slidesPerView={1}
      modules={[Navigation, Pagination, Autoplay, Keyboard]}
      navigation
      keyboard={{
        enabled: true,
      }}
      autoplay={true}
      lazy="true"
      pagination={{ clickable: true }}
      style={{
        "--swiper-pagination-color": "#DB4444",
      }}
    >
      {banners?.map((banner) => (
        <SwiperSlide data-swiper-autoplay={banner.SlideDelay} key={banner._id}>
          <Link to={banner?.Link}>
            {banner?.MediaType.includes("video") && (
              <video autoPlay muted loop>
                <source src={banner.Media} type={banner?.MediaType} />
                Your browser does not support the video tag.
              </video>
            )}
            {banner?.MediaType.includes("image") && (
              <>
                <img
                  src={banner.Media}
                  alt={banner?.Name + " Media"}
                  loading="lazy"
                />
                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
              </>
            )}
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Banner;
