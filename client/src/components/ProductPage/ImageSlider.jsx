import { Swiper, SwiperSlide } from "swiper/react";
import { isBrowser } from "react-device-detect";
import { Navigation, Zoom, Thumbs, Pagination } from "swiper/modules";
import "swiper/css";
import PropTypes from "prop-types";
import { useState } from "react";

function ImageSlider({ images }) {
  const [imagesNavSlider, setImagesNavSlider] = useState(null);

  return (
    <div className="slider__flex">
      {isBrowser && (
        <div className="slider__col">
          <div className="slider__thumbs">
            <Swiper
              onSwiper={setImagesNavSlider}
              direction="vertical"
              spaceBetween={10}
              slidesPerView={5}
              lazy="true"
              className="swiper-container1"
              breakpoints={{
                0: {
                  direction: "horizontal",
                },
                768: {
                  direction: "vertical",
                },
              }}
            >
              {images?.map((image, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="slider__image swiper-zoom-container">
                      <img
                        src={image}
                        alt={"slide image " + index}
                        loading="lazy"
                      />
                    </div>
                    <div className="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}

      <div className="slider__images">
        <Swiper
          thumbs={{
            swiper:
              imagesNavSlider && !imagesNavSlider.destroyed
                ? imagesNavSlider
                : null,
          }}
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={32}
          mousewheel={true}
          navigation
          pagination={{ clickable: true }}
          style={{
            "--swiper-pagination-color": "#DB4444",
          }}
          zoom={true}
          lazy="true"
          breakpoints={{
            0: {
              direction: "horizontal",
            },
            768: {
              direction: "horizontal",
            },
          }}
          className="swiper-container2"
          modules={[Navigation, Zoom, Thumbs, Pagination]}
        >
          {images?.map((image, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="slider__image swiper-zoom-container">
                  <img
                    src={image}
                    alt={"slide image " + index}
                    loading="lazy"
                  />
                </div>
                <div className="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

ImageSlider.propTypes = {
  images: PropTypes.array,
};

export default ImageSlider;
