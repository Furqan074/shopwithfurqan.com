import { useTranslation } from "react-i18next";
function WhyUsSection() {
  const { t } = useTranslation();
  return (
    <section className="why-us-section">
      <div className="delivery">
        <div className="outer-circle">
          <div className="inner-circle">
            <svg
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_494_288)">
                <path
                  d="M12.1667 31.6667C14.0076 31.6667 15.5 30.1743 15.5 28.3333C15.5 26.4924 14.0076 25 12.1667 25C10.3257 25 8.83333 26.4924 8.83333 28.3333C8.83333 30.1743 10.3257 31.6667 12.1667 31.6667Z"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.8333 31.6667C30.6743 31.6667 32.1667 30.1743 32.1667 28.3333C32.1667 26.4924 30.6743 25 28.8333 25C26.9924 25 25.5 26.4924 25.5 28.3333C25.5 30.1743 26.9924 31.6667 28.8333 31.6667Z"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.83331 28.3335H7.49998C6.39541 28.3335 5.49998 27.4381 5.49998 26.3335V21.6668M3.83331 8.3335H20.1666C21.2712 8.3335 22.1666 9.22893 22.1666 10.3335V28.3335M15.5 28.3335H25.5M32.1667 28.3335H33.5C34.6046 28.3335 35.5 27.4381 35.5 26.3335V18.3335M35.5 18.3335H22.1666M35.5 18.3335L31.0826 10.9712C30.7211 10.3688 30.0701 10.0002 29.3676 10.0002H22.1666"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 28H7.16667C6.0621 28 5.16667 27.1046 5.16667 26V21.3333M3.5 8H19.8333C20.9379 8 21.8333 8.89543 21.8333 10V28M15.5 28H25.1667M32.5 28H33.1667C34.2712 28 35.1667 27.1046 35.1667 26V18M35.1667 18H21.8333M35.1667 18L30.7493 10.6377C30.3878 10.0353 29.7368 9.66667 29.0343 9.66667H21.8333"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.5 11.8182H12.1667"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.31818 15.4546H8.98484"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.5 19.0909H12.1667"
                  stroke="#FAFAFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="text">
          <div>{t("FREE_AND_FAST_DELIVERY")}</div>
          <span>{t("Free_delivery_message")}</span>
        </div>
      </div>
      <div className="services">
        <div className="outer-circle">
          <div className="inner-circle">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_494_305)">
                <path
                  d="M13.3333 25C13.3333 23.159 11.841 21.6666 10 21.6666C8.15906 21.6666 6.66667 23.159 6.66667 25V28.3333C6.66667 30.1742 8.15906 31.6666 10 31.6666C11.841 31.6666 13.3333 30.1742 13.3333 28.3333V25Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M33.3333 25C33.3333 23.159 31.841 21.6666 30 21.6666C28.1591 21.6666 26.6667 23.159 26.6667 25V28.3333C26.6667 30.1742 28.1591 31.6666 30 31.6666C31.841 31.6666 33.3333 30.1742 33.3333 28.3333V25Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66667 25V20C6.66667 16.4637 8.07143 13.0724 10.5719 10.5719C13.0724 8.07138 16.4638 6.66663 20 6.66663C23.5362 6.66663 26.9276 8.07138 29.4281 10.5719C31.9286 13.0724 33.3333 16.4637 33.3333 20V25"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M30 31.6666C30 32.9927 28.9464 34.2645 27.0711 35.2022C25.1957 36.1398 22.6522 36.6666 20 36.6666"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="text">
          <div>{t("24/7_CUSTOMER_SERVICE")}</div>
          <span>{t("customer_support")}</span>
        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;
