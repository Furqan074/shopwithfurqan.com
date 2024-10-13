import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import PropTypes from "prop-types";
import ProductCard from "../ProductCard.jsx";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function TodaySection({ products }) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isActive, setIsActive] = useState(true);
  const [saleHeading, setSaleHeading] = useState("");

  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  };

  const getFlashSale = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/sale`
      );
      const data = await response.json();
      if (data.success) {
        const { isActive, title, endDate } = data.flashsale[0] || {};
        setIsActive(endDate > new Date());
        setSaleHeading(title);
        const initialCountdown = calculateTimeRemaining(endDate);
        setCountdown(initialCountdown);

        // Save data to local storage
        localStorage.setItem(
          "flashSaleData",
          JSON.stringify({
            isActive,
            title,
            endDate,
            timestamp: new Date().getTime(), // current timestamp
          })
        );
      }
    } catch (error) {
      console.error("Error fetching flash sale data:", error);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      // Get data from local storage
      const storedData = localStorage.getItem("flashSaleData");
      const currentTime = new Date().getTime();

      if (storedData) {
        const { isActive, title, endDate, timestamp } = JSON.parse(storedData);
        const isDataFresh = currentTime - timestamp < 60000; // 60 seconds cache duration

        if (isDataFresh) {
          // Use data from local storage if it's fresh
          setIsActive(isActive);
          setSaleHeading(title);
          const initialCountdown = calculateTimeRemaining(endDate);
          setCountdown(initialCountdown);
        } else {
          // Data is stale, fetch new data from server
          getFlashSale();
        }
      } else {
        // No data in local storage, fetch from server
        getFlashSale();
      }

      // Update countdown every second
      const timer = setInterval(() => {
        const storedData = localStorage.getItem("flashSaleData");
        const currentTime = new Date().getTime();

        if (storedData) {
          const { endDate } = JSON.parse(storedData);
          const newCountdown = calculateTimeRemaining(endDate);
          setCountdown(newCountdown);

          // Fetch new data if the countdown is zero or if the data is stale
          const isDataStale =
            currentTime - JSON.parse(storedData).timestamp >= 60000;
          if (
            (newCountdown.days === 0 &&
              newCountdown.hours === 0 &&
              newCountdown.minutes === 0 &&
              newCountdown.seconds === 0) ||
            isDataStale
          ) {
            getFlashSale();
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [getFlashSale, isActive]);

  return (
    <>
      <section className="today-section">
        <div className="section-header">
          <div className="section-label">
            <div className="rectangle"></div>
            <h2>{t("today_label")}</h2>
          </div>
          <div className="section-heading flash-sale">
            {!isActive && <h3>{t("latest_heading")}</h3>}
            {isActive && (
              <>
                <h3>{saleHeading}</h3>
                <div className="counter">
                  <div>
                    <span>{t("days")}</span>
                    <div className="number">
                      {countdown.days.toString().padStart(2, "0")}
                    </div>
                  </div>
                  <span className="semicolon">:</span>
                  <div>
                    <span>{t("hours")}</span>
                    <div className="number">
                      {countdown.hours.toString().padStart(2, "0")}
                    </div>
                  </div>
                  <span className="semicolon">:</span>
                  <div>
                    <span>{t("minutes")}</span>
                    <div className="number">
                      {countdown.minutes.toString().padStart(2, "0")}
                    </div>
                  </div>
                  <span className="semicolon">:</span>
                  <div>
                    <span>{t("seconds")}</span>
                    <div className="number">
                      {countdown.seconds.toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="section-action">
              <span className="mySlider-prev">
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
              <span className="mySlider-next">
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
            slidesPerView={5}
            spaceBetween={0}
            modules={[Navigation]}
            navigation={{
              prevEl: ".mySlider-prev",
              nextEl: ".mySlider-next",
            }}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.Name}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <Link to="/collection/today">
        <button className="viewAll-btn">{t("view_all_products_btn")}</button>
      </Link>
    </>
  );
}

TodaySection.propTypes = {
  products: PropTypes.array,
};

export default TodaySection;
