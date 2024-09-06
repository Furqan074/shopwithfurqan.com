import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishCount, setWishCount] = useState(0);
  // FIXME get the functionality of the wishlist here
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishCount(wishlist.length);
  }, []);

  return (
    <WishlistContext.Provider value={{ wishCount, setWishCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

WishlistProvider.propTypes = {
  children: PropTypes.any,
};

export { WishlistProvider, WishlistContext };
