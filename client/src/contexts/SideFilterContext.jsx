import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const SideFilterContext = createContext();

export const SideFilterProvider = ({ children }) => {
  const [isSideFilterOpen, setSideFilterOpen] = useState(false);

  const openSideFilter = () => {
    setSideFilterOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSideFilter = () => {
    setSideFilterOpen(false);
    document.body.style.overflow = "visible";
  };

  return (
    <SideFilterContext.Provider
      value={{ isSideFilterOpen, openSideFilter, closeSideFilter }}
    >
      {children}
    </SideFilterContext.Provider>
  );
};

SideFilterProvider.propTypes = {
  children: PropTypes.any,
};
