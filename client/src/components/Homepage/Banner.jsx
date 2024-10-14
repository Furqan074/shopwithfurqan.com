import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import speakerOff from "../../assets/images/speaker-off.png";
import speakerOn from "../../assets/images/speaker.png";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [mutedStates, setMutedStates] = useState({});

  const getAllBanners = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/banners`
      );

      const data = await response.json();

      if (data.success) {
        setBanners(data.allBanners);

        const initialMutedStates = {};
        data.allBanners.forEach((banner) => {
          if (banner.MediaType.includes("video")) {
            initialMutedStates[banner._id] = true;
          }
        });
        setMutedStates(initialMutedStates);
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

  const toggleMute = (id) => {
    setMutedStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

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
          {banner?.MediaType.includes("video") && (
            <>
              <span
                style={{
                  width: "30px",
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  padding: "10px",
                  background: "rgb(255, 255, 255, 0.5)",
                  borderRadius: "50%",
                  zIndex: "400",
                  cursor: "pointer",
                }}
                onClick={() => toggleMute(banner._id)}
              >
                <img
                  src={mutedStates[banner._id] ? speakerOff : speakerOn}
                  alt={`speaker ${mutedStates[banner._id] ? "muted " : ""}icon`}
                />
              </span>
              <video autoPlay muted={mutedStates[banner._id]} loop>
                <source src={banner.Media} type={banner?.MediaType} />
                Your browser does not support the video tag.
              </video>
              <Link
                to={banner?.Link}
                style={{ position: "absolute", inset: "0", zIndex: "200" }}
              ></Link>
            </>
          )}
          {banner?.MediaType.includes("image") && (
            <Link to={banner?.Link}>
              <img src={banner.Media} alt={"Banner Image"} loading="lazy" />
              <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
            </Link>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Banner;
