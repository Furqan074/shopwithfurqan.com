import { useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CartContext } from "../contexts/CartContext.jsx";
import PropTypes from "prop-types";

function ScrollToTopAndLoader({ loadingBarRef }) {
  const { closeCart } = useContext(CartContext);
  const { pathname } = useLocation();
  const prevPathnameRef = useRef();

  useEffect(() => {
    if (prevPathnameRef.current && prevPathnameRef.current !== pathname) {
      window.scrollTo(0, 0);
      closeCart();
      loadingBarRef.current?.continuousStart();
    }
    prevPathnameRef.current = pathname;

    loadingBarRef.current?.complete();
  }, [pathname, closeCart, loadingBarRef]);

  return null;
}

ScrollToTopAndLoader.propTypes = {
  loadingBarRef: PropTypes.any,
};

export default ScrollToTopAndLoader;
