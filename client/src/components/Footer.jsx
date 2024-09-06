import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="follow">
        {t("follow_us")}
        <br />
        <div className="social-links">
          <a
            href="https://www.facebook.com/profile.php?id=61562011524465&mibextid=ZbWKwL"
            target="_blank"
          >
            <svg
              width="13"
              height="22"
              viewBox="0 0 13 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.25 8.45833H12.6875L12.0833 10.875H7.25V21.75H4.83333V10.875H0V8.45833H4.83333V6.19633C4.83333 4.04187 5.05808 3.26008 5.47858 2.47225C5.89064 1.69385 6.52718 1.0573 7.30558 0.64525C8.09342 0.22475 8.87521 0 11.0297 0C11.6604 0 12.2138 0.0604168 12.6875 0.18125V2.41667H11.0297C9.42983 2.41667 8.94287 2.51092 8.44625 2.77675C8.07892 2.9725 7.80583 3.24558 7.61008 3.61292C7.34425 4.10954 7.25 4.5965 7.25 6.19633V8.45833Z"
                fill="white"
              />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/shopwithfurqan_?&igsh=ZDNlZDc0MzIxNw%3D%3D"
            target="_blank"
          >
            <svg
              width="23"
              height="22"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.6042 1H6.52083C5.23895 1 4.00958 1.50922 3.10315 2.41565C2.19672 3.32208 1.6875 4.55145 1.6875 5.83333V17.9167C1.6875 19.1985 2.19672 20.4279 3.10315 21.3343C4.00958 22.2408 5.23895 22.75 6.52083 22.75H18.6042C19.886 22.75 21.1154 22.2408 22.0218 21.3343C22.9283 20.4279 23.4375 19.1985 23.4375 17.9167V5.83333C23.4375 4.55145 22.9283 3.32208 22.0218 2.41565C21.1154 1.50922 19.886 1 18.6042 1Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12.5625 16.7083C13.8444 16.7083 15.0738 16.1991 15.9802 15.2926C16.8866 14.3862 17.3958 13.1568 17.3958 11.875C17.3958 10.5931 16.8866 9.3637 15.9802 8.45728C15.0738 7.55085 13.8444 7.04163 12.5625 7.04163C11.2806 7.04163 10.0512 7.55085 9.14482 8.45728C8.2384 9.3637 7.72917 10.5931 7.72917 11.875C7.72917 13.1568 8.2384 14.3862 9.14482 15.2926C10.0512 16.1991 11.2806 16.7083 12.5625 16.7083V16.7083Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M19.2083 6.43754C19.5288 6.43754 19.8361 6.31023 20.0628 6.08363C20.2894 5.85702 20.4167 5.54968 20.4167 5.22921C20.4167 4.90874 20.2894 4.60139 20.0628 4.37479C19.8361 4.14818 19.5288 4.02087 19.2083 4.02087C18.8879 4.02087 18.5805 4.14818 18.3539 4.37479C18.1273 4.60139 18 4.90874 18 5.22921C18 5.54968 18.1273 5.85702 18.3539 6.08363C18.5805 6.31023 18.8879 6.43754 19.2083 6.43754Z"
                fill="white"
              />
            </svg>
          </a>
          {/* <a href="https://www.tiktok.com/@shopwithfurqan" target="_blank">
            <svg
              width="23"
              height="22"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.4375 7.11111V16.8889C23.4375 18.5097 22.7937 20.064 21.6476 21.2101C20.5015 22.3562 18.9472 23 17.3264 23H7.54861C5.92784 23 4.37346 22.3562 3.2274 21.2101C2.08135 20.064 1.4375 18.5097 1.4375 16.8889V7.11111C1.4375 5.49034 2.08135 3.93596 3.2274 2.7899C4.37346 1.64385 5.92784 1 7.54861 1H17.3264C18.9472 1 20.5015 1.64385 21.6476 2.7899C22.7937 3.93596 23.4375 5.49034 23.4375 7.11111Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.99305 12C9.26786 12 8.55894 12.215 7.95596 12.6179C7.35298 13.0208 6.88302 13.5935 6.6055 14.2635C6.32797 14.9334 6.25536 15.6707 6.39684 16.382C6.53832 17.0932 6.88754 17.7466 7.40033 18.2593C7.91312 18.7721 8.56646 19.1214 9.27772 19.2628C9.98899 19.4043 10.7262 19.3317 11.3962 19.0542C12.0662 18.7767 12.6389 18.3067 13.0418 17.7037C13.4447 17.1007 13.6597 16.3918 13.6597 15.6666V4.66663C14.0667 5.88885 15.6153 8.33329 18.5486 8.33329"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a> */}
          {/* <a href="https://www.youtube.com/@Shopwithfurqan6321/" target="_blank">
            <svg
              width="32"
              height="32"
              viewBox="0 0 38 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.2177 4.44033C32.0388 3.77376 31.6878 3.16597 31.1997 2.67795C30.7117 2.18994 30.1039 1.83886 29.4374 1.65996C27.6163 0.956406 9.97398 0.611712 4.85551 1.67963C4.18885 1.8586 3.58099 2.2098 3.09297 2.69796C2.60494 3.18612 2.25392 3.79408 2.07514 4.46079C1.25275 8.06748 1.19058 15.8648 2.0956 19.5525C2.2745 20.2191 2.62558 20.8269 3.1136 21.3149C3.60161 21.8029 4.2094 22.154 4.87597 22.3329C8.48266 23.1632 25.6292 23.2796 29.4578 22.3329C30.1244 22.154 30.7322 21.8029 31.2202 21.3149C31.7082 20.8269 32.0593 20.2191 32.2382 19.5525C33.1149 15.6232 33.177 8.30908 32.2177 4.44033Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.3452 11.9959L14.1237 7.28113V16.7106L22.3452 11.9959Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a> */}
        </div>
      </div>

      <hr />

      <div className="footer-links">
        <div className="Menu">
          <div>{t("footer_menu_heading")}</div>
          <ul>
            <li>
              <Link to="/">{t("home")}</Link>
            </li>
            {/* <li>
              <Link to="#">About Us</Link>
            </li> */}
            {/* <li>
              <Link to="#">Contact Us</Link>
            </li> */}
            <li>
              <Link to="/register">{t("sign_up")}</Link>
            </li>
            <li>
              <Link to="/login">{t("sign_in")}</Link>
            </li>
          </ul>
        </div>
        <div className="policies">
          <div>{t("footer_policies_heading")}</div>
          <ul>
            <li>
              <a href="/policies.html#privacy-policy">{t("privacy_policy")}</a>
            </li>
            <li>
              <a href="/policies.html#terms-condition">
                {t("terms_condition")}
              </a>
            </li>
            <li>
              <a href="/policies.html#return-policy">{t("return_policy")}</a>
            </li>
            <li>
              <a href="/faqs.html">{t("faqs")}</a>
            </li>
          </ul>
        </div>
        <div className="contact">
          <div>{t("footer_Get_In_Touch_heading")}</div>
          <ul>
            <li>
              <a
                href="https://wa.me/+923283943011/?text=Hello!"
                target="_blank"
              >
                +92-328-3943011
              </a>
            </li>
            <li>
              {/* TODO test is this working? */}
              <a href="mailto:contact@shopwithfurqan.com" target="_blank">
                contact@shopwithfurqan.com
              </a>
            </li>
            {/* <li className="address">
              <iframe
                src="https://www.google.com/maps/embed"
                width="400"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="copyright">
        <Link to="/">{t("Copyright")}</Link>
      </div>
      <div className="credit">
        {t("credit")}
        <a
          href="https://www.upwork.com/freelancers/~011592ad227b310e42"
          target="_blank"
        >
          Faizan Fazul.
        </a>
      </div>
    </footer>
  );
}

export default Footer;
