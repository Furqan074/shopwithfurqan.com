import { Swiper, SwiperSlide } from "swiper/react";
import { isBrowser } from "react-device-detect";
import { Navigation, Zoom, Thumbs, Pagination } from "swiper/modules";
import "swiper/css";
import PropTypes from "prop-types";
import { useState } from "react";
import loadingImg from "../../assets/images/loading.gif";
import speakerOff from "../../assets/images/speaker-off.png";
import speakerOn from "../../assets/images/speaker.png";

function MediaSlider({ medias }) {
  const [mediasNavSlider, setMediasNavSlider] = useState(null);
  const [mutedStates, setMutedStates] = useState(
    medias?.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );

  const toggleMute = (index) => {
    setMutedStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  return (
    <div className="slider__flex">
      {isBrowser && (
        <div className="slider__col">
          <div className="slider__thumbs">
            <Swiper
              onSwiper={setMediasNavSlider}
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
              {medias?.map((media, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="slider__media swiper-zoom-container">
                      {media?.mediaType === "video" && (
                        <video autoPlay loop muted poster={loadingImg}>
                          <source src={media.source} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {media?.mediaType === "image" && (
                        <>
                          <img
                            src={media.source}
                            alt={"slide media " + index}
                            loading="lazy"
                          />
                          <div className="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
                        </>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}

      <div className="slider__medias">
        <Swiper
          thumbs={{
            swiper:
              mediasNavSlider && !mediasNavSlider.destroyed
                ? mediasNavSlider
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
          {medias?.map((media, index) => {
            return (
              <SwiperSlide key={index}>
                {media?.mediaType.includes("video") && (
                  <div
                    className="slider__media"
                    onClick={() => toggleMute(index)}
                  >
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
                        }}
                      >
                        <img
                          src={mutedStates[index] ? speakerOff : speakerOn}
                          alt={`speaker ${
                            mutedStates[index] ? "muted " : ""
                          }icon`}
                        />
                      </span>
                      <video
                        autoPlay
                        loop
                        muted={mutedStates[index]}
                        poster={loadingImg}
                      >
                        <source src={media.source} />
                        Your browser does not support the video tag.
                      </video>
                    </>
                  </div>
                )}
                {media?.mediaType.includes("image") && (
                  <div className="slider__media swiper-zoom-container">
                    <img
                      src={media.source}
                      alt={"slide media " + index}
                      loading="lazy"
                    />
                    <div className="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

MediaSlider.propTypes = {
  medias: PropTypes.array,
};

export default MediaSlider;
