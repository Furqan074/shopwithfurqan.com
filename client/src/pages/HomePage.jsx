import { isTablet, isBrowser } from "react-device-detect";
import { useState, useCallback, useEffect } from "react";
import HomePageCategories from "../components/Homepage/HomePageCategories.jsx";
import HomePageCategoriesMobile from "../components/Homepage/HomePageCategoriesMobile.jsx";
import Banner from "../components/Homepage/Banner.jsx";
import TodaySection from "../components/Homepage/TodaySection.jsx";
import CategoriesSection from "../components/Homepage/CategoriesSection.jsx";
import ThisMonthSection from "../components/Homepage/ThisMonthSection.jsx";
import NewArrivalSection from "../components/Homepage/NewArrivalSection.jsx";
import ExploreProductsSection from "../components/Homepage/ExploreProductsSection.jsx";
import WhyUsSection from "../components/Homepage/WhyUsSection.jsx";

function HomePage() {
  document.title = "Shopwithfurqan | Make Your Life Easy";
  const [categories, setCategories] = useState([]);
  const [todaySectionProducts, setTodaySectionProducts] = useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [exploreProducts, setExploreProducts] = useState([]);
  const [bestSellingProducts, steBestSellingProducts] = useState([]);

  const getAllCategories = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/categories`
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.allCategories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error Getting Homepage Categories:", error);
      setCategories([]);
    }
  }, []);

  const getAllProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products`
      );
      const data = await response.json();

      if (data.success) {
        setTodaySectionProducts(data.TodayProducts);
        steBestSellingProducts(data.BestSellingProducts);
        setExploreProducts(data.ExploreProducts);
        setNewArrivalProducts(data.NewArrivalProducts);
      } else {
        setTodaySectionProducts([]);
        steBestSellingProducts([]);
        setExploreProducts([]);
        setNewArrivalProducts([]);
      }
    } catch (error) {
      console.error("Error Getting Products:", error);
      setTodaySectionProducts([]);
      steBestSellingProducts([]);
      setExploreProducts([]);
      setNewArrivalProducts([]);
    }
  }, []);

  useEffect(() => {
    getAllCategories();
    getAllProducts();
  }, [getAllCategories, getAllProducts]);
  return (
    <main>
      <section className="hero-section">
        {categories.length > 0 &&
          (isBrowser || isTablet ? (
            <HomePageCategories categories={categories} />
          ) : (
            <HomePageCategoriesMobile categories={categories} />
          ))}
        <Banner />
      </section>
      {todaySectionProducts.length > 0 && (
        <TodaySection products={todaySectionProducts} />
      )}
      {categories.length > 0 && <CategoriesSection categories={categories} />}
      {bestSellingProducts.length > 0 && (
        <ThisMonthSection products={bestSellingProducts} />
      )}
      {newArrivalProducts.length >= 4 && (
        <NewArrivalSection products={newArrivalProducts} />
      )}
      {exploreProducts.length > 0 && (
        <ExploreProductsSection products={exploreProducts} />
      )}
      <WhyUsSection />
    </main>
  );
}

export default HomePage;
