import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
function ReviewsSection({ averageRating, reviews, ratingLabel }) {
  const { t } = useTranslation();
  const countReviewsByRating = (rating) => {
    return reviews.filter((review) => review.Rating === rating).length;
  };
  const totalReviews = reviews.length;
  // TODO add pagination here
  return (
    <div className="product-reviews-section">
      <div className="rating">
        <div className="rating-average">
          <h2>{t("Ratings_Reviews")}</h2>
          <div className="rating-average-qty">
            <span>{averageRating.toFixed(1)}</span>
            <div className="rating-label">
              <div className="rating-stars">
                <input value="5" id="star5" type="radio" defaultChecked />
                <label htmlFor="star5" style={{ color: "#fff" }}></label>
              </div>
              <div>{ratingLabel}</div>
            </div>
          </div>
          {averageRating > 0 && (
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <span key={averageRating + index}>
                  <input
                    value={index}
                    id={`star${index}`}
                    type="radio"
                    defaultChecked={averageRating > index}
                  />
                  <label htmlFor={`star${index}`}></label>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="reviews-qty">
          <div className="reviews-qty-stars">
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" defaultChecked />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" defaultChecked />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" defaultChecked />
              <label htmlFor="star1"></label>
            </div>
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" defaultChecked />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" defaultChecked />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" defaultChecked />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" defaultChecked />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
            <div className="rating-stars">
              <input value="5" id="star5" type="radio" defaultChecked />
              <label htmlFor="star5"></label>
              <input value="4" id="star4" type="radio" />
              <label htmlFor="star4"></label>
              <input value="3" id="star3" type="radio" />
              <label htmlFor="star3"></label>
              <input value="2" id="star2" type="radio" />
              <label htmlFor="star2"></label>
              <input value="1" id="star1" type="radio" />
              <label htmlFor="star1"></label>
            </div>
          </div>
          <div className="reviews-qty-progress">
            {[5, 4, 3, 2, 1].map((num) => {
              const count = countReviewsByRating(num);
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div className="reviews-qty-item" key={num}>
                  <progress value={percentage} max={100}></progress>
                  <span>{countReviewsByRating(num)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="user-reviews-section">
        {reviews?.map((review, index) => (
          <div className="review" key={index}>
            <div className="review-heading">
              <div>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <span key={review.Rating + index}>
                      <input
                        value={index}
                        id={`star${index}`}
                        type="radio"
                        defaultChecked={review.Rating > index}
                      />
                      <label htmlFor={`star${index}`}></label>
                    </span>
                  ))}
                </div>
                <span className="user-name">{review.ReviewerName}</span>
              </div>
              <span className="review-date">
                {new Date(review.ReviewDate).toISOString().split("T")[0]}
              </span>
            </div>
            <div className="review-body">
              <div className="review-content">{review.ReviewText}</div>
              {/* {token && (
                <div className="review-action">
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 7.00012L11.014 6.83612C10.9902 6.97932 10.9978 7.12598 11.0364 7.26591C11.075 7.40585 11.1436 7.53571 11.2374 7.64648C11.3312 7.75724 11.4481 7.84625 11.5797 7.90732C11.7114 7.96839 11.8548 8.00006 12 8.00012V7.00012ZM1 7.00012V6.00012C0.734784 6.00012 0.48043 6.10548 0.292893 6.29302C0.105357 6.48055 0 6.73491 0 7.00012H1ZM3 18.0001H14.36V16.0001H3V18.0001ZM15.56 6.00012H12V8.00012H15.56V6.00012ZM12.987 7.16412L13.792 2.32912L11.82 2.00012L11.014 6.83612L12.987 7.16412ZM11.82 0.00012207H11.606V2.00012H11.82V0.00012207ZM8.277 1.78112L5.763 5.55512L7.427 6.66512L9.943 2.89112L8.277 1.78112ZM4.93 6.00012H1V8.00012H4.93V6.00012ZM0 7.00012V15.0001H2V7.00012H0ZM17.302 15.5881L18.502 9.58812L16.542 9.19612L15.342 15.1961L17.302 15.5881ZM5.763 5.55512C5.67165 5.69204 5.54692 5.80429 5.40178 5.88192C5.25665 5.95954 5.09459 6.00015 4.93 6.00012V8.00012C5.42387 8.00009 5.91009 7.87813 6.3455 7.64507C6.78092 7.41201 7.15207 7.07506 7.426 6.66412L5.763 5.55512ZM13.792 2.32912C13.8398 2.04266 13.8246 1.74923 13.7475 1.46923C13.6704 1.18923 13.5333 0.929378 13.3456 0.707738C13.1579 0.486098 12.9242 0.307988 12.6608 0.185788C12.3973 0.0635883 12.1104 0.000231579 11.82 0.00012207V2.00012L13.792 2.32912ZM15.56 8.00012C15.708 8.00006 15.8541 8.03285 15.9879 8.0961C16.1217 8.15936 16.2397 8.25152 16.3336 8.36593C16.4274 8.48035 16.4947 8.61416 16.5306 8.75772C16.5664 8.90128 16.571 9.05102 16.542 9.19612L18.502 9.58812C18.589 9.15297 18.5783 8.70394 18.4708 8.2734C18.3633 7.84286 18.1617 7.44153 17.8804 7.09833C17.599 6.75513 17.2451 6.47862 16.844 6.28871C16.443 6.09881 16.0048 6.00024 15.561 6.00012L15.56 8.00012ZM14.36 18.0001C15.0536 18.0002 15.7258 17.7599 16.2622 17.3201C16.7986 16.8803 17.166 16.2683 17.302 15.5881L15.342 15.1961C15.2966 15.4231 15.174 15.6273 14.9949 15.7739C14.8158 15.9205 14.5914 16.0004 14.36 16.0001V18.0001ZM11.606 0.00012207C10.9475 0.000133323 10.2993 0.162696 9.71871 0.473383C9.13816 0.78407 8.64228 1.23327 8.277 1.78112L9.943 2.89112C10.1256 2.6171 10.372 2.39241 10.6623 2.23697C10.9526 2.08154 11.2767 2.00018 11.606 2.00012V0.00012207ZM3 16.0001C2.73478 16.0001 2.48043 15.8948 2.29289 15.7072C2.10536 15.5197 2 15.2653 2 15.0001H0C0 15.7958 0.316071 16.5588 0.87868 17.1214C1.44129 17.6841 2.20435 18.0001 3 18.0001V16.0001Z"
                      fill="black"
                      fillOpacity="0.6"
                    />
                    <path d="M4 8.00012L4 16.0001L4 8.00012Z" fill="black" />
                    <path
                      d="M4 8.00012L4 16.0001"
                      stroke="black"
                      strokeOpacity="0.6"
                      strokeWidth="2"
                    />
                  </svg>
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 11.0001L11.014 11.1641C10.9902 11.0209 10.9978 10.8743 11.0364 10.7343C11.075 10.5944 11.1436 10.4645 11.2374 10.3538C11.3312 10.243 11.4481 10.154 11.5797 10.0929C11.7114 10.0319 11.8548 10.0002 12 10.0001V11.0001ZM1 11.0001L1 12.0001C0.734784 12.0001 0.48043 11.8948 0.292893 11.7072C0.105357 11.5197 0 11.2653 0 11.0001H1ZM3 0.00012207H14.36V2.00012H3L3 0.00012207ZM15.56 12.0001L12 12.0001V10.0001H15.56V12.0001ZM12.987 10.8361L13.792 15.6711L11.82 16.0001L11.014 11.1641L12.987 10.8361ZM11.82 18.0001H11.606V16.0001H11.82V18.0001ZM8.277 16.2191L5.763 12.4451L7.427 11.3351L9.943 15.1091L8.277 16.2191ZM4.93 12.0001H1L1 10.0001H4.93V12.0001ZM0 11.0001L0 3.00012H2L2 11.0001H0ZM17.302 2.41212L18.502 8.41212L16.542 8.80412L15.342 2.80412L17.302 2.41212ZM5.763 12.4451C5.67165 12.3082 5.54692 12.196 5.40178 12.1183C5.25665 12.0407 5.09459 12.0001 4.93 12.0001V10.0001C5.42387 10.0002 5.91009 10.1221 6.3455 10.3552C6.78092 10.5882 7.15207 10.9252 7.426 11.3361L5.763 12.4451ZM13.792 15.6711C13.8398 15.9576 13.8246 16.251 13.7475 16.531C13.6704 16.811 13.5333 17.0709 13.3456 17.2925C13.1579 17.5141 12.9242 17.6923 12.6608 17.8145C12.3973 17.9367 12.1104 18 11.82 18.0001V16.0001L13.792 15.6711ZM15.56 10.0001C15.708 10.0002 15.8541 9.9674 15.9879 9.90414C16.1217 9.84088 16.2397 9.74872 16.3336 9.63431C16.4274 9.5199 16.4947 9.38609 16.5306 9.24252C16.5664 9.09896 16.571 8.94923 16.542 8.80412L18.502 8.41212C18.589 8.84727 18.5783 9.2963 18.4708 9.72684C18.3633 10.1574 18.1617 10.5587 17.8804 10.9019C17.599 11.2451 17.2451 11.5216 16.844 11.7115C16.443 11.9014 16.0048 12 15.561 12.0001L15.56 10.0001ZM14.36 0.00012207C15.0536 7.82013e-05 15.7258 0.240387 16.2622 0.680149C16.7986 1.11991 17.166 1.73196 17.302 2.41212L15.342 2.80412C15.2966 2.57718 15.174 2.37299 14.9949 2.22637C14.8158 2.07976 14.5914 1.9998 14.36 2.00012V0.00012207ZM11.606 18.0001C10.9475 18.0001 10.2993 17.8375 9.71871 17.5269C9.13816 17.2162 8.64228 16.767 8.277 16.2191L9.943 15.1091C10.1256 15.3831 10.372 15.6078 10.6623 15.7633C10.9526 15.9187 11.2767 16.0001 11.606 16.0001V18.0001ZM3 2.00012C2.73478 2.00012 2.48043 2.10548 2.29289 2.29301C2.10536 2.48055 2 2.73491 2 3.00012H0C0 2.20447 0.316071 1.44141 0.87868 0.878801C1.44129 0.316193 2.20435 0.00012207 3 0.00012207L3 2.00012Z"
                      fill="black"
                      fillOpacity="0.6"
                    />
                    <path
                      d="M4 10.0001L4 2.00012"
                      stroke="black"
                      strokeOpacity="0.6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReviewsSection.propTypes = {
  averageRating: PropTypes.number,
  ratingLabel: PropTypes.string,
  reviews: PropTypes.array,
};

export default ReviewsSection;
