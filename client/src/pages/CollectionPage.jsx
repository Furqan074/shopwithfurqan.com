import SideFilter from "../components/collectionPage/SideFilter";
import TopFilter from "../components/collectionPage/TopFilter";
import ProductRow from "../components/ProductRow";
import Loading from "../components/Loading.jsx";
import { SideFilterProvider } from "../contexts/SideFilterContext";
import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

function CollectionPage() {
  const { name } = useParams();
  document.title = name + " | Shopwithfurqan";
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [byPriceRange, setByPriceRange] = useState("");
  const [byRating, setByRating] = useState("");
  const [byBrand, setByBrand] = useState(null);
  const [byMaterial, setByMaterial] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages.length) setCurrentPage(currentPage + 1);
  };

  const getCollectionProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/collection/${name}?ribbon=${sortBy}&brand=${byBrand}&rating=${byRating}&material=${byMaterial}&price_range=${byPriceRange}&limit=16&page=${currentPage}`
      );
      const data = await response.json();

      if (data.success) {
        setCollectionProducts(data.productsFound);
        setMaterials(data.productsMaterial);
        setBrands(data.productsBrands);
        setCategories(data.productsCollection);
        setTotalPages(data.totalPages);
        setLoading(false);
      } else {
        setCollectionProducts([]);
      }
    } catch (error) {
      console.error("Error Getting Collection Products:", error);
      setCollectionProducts([]);
    } finally {
      setLoading(false);
    }
  }, [name, sortBy, byRating, byPriceRange, byBrand, byMaterial, currentPage]);

  useEffect(() => {
    setCollectionProducts([]);
    getCollectionProducts();
  }, [getCollectionProducts]);

  return (
    <section className="collection-page-section">
      <SideFilterProvider>
        <SideFilter
          collections={categories}
          materials={materials}
          brands={brands}
          setByBrand={setByBrand}
          setByMaterial={setByMaterial}
          setByRating={setByRating}
          setByPriceRange={setByPriceRange}
          byRating={byRating}
          byMaterial={byMaterial}
          byPriceRange={byPriceRange}
          byBrand={byBrand}
          sortBy={sortBy}
          collectionName={name}
          isLoading={isLoading}
        />
        <div className="collection-page-right-side">
          <TopFilter
            qty={collectionProducts.length}
            collectionName={name}
            setSortBy={setSortBy}
          />
          {isLoading && <Loading />}
          <ProductRow products={collectionProducts} />
          {totalPages.length > 16 && (
            <div
              className="pagination"
              style={{ background: "none", border: "none" }}
            >
              <div>
                {currentPage !== 1 && (
                  <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={goToPrevPage}
                  >
                    <path
                      d="M7.37939 0.364748C7.48811 0.479616 7.57436 0.616059 7.63321 0.766264C7.69206 0.91647 7.72235 1.07749 7.72235 1.2401C7.72235 1.40272 7.69206 1.56374 7.63321 1.71395C7.57436 1.86415 7.48811 2.00059 7.37939 2.11546L2.82916 6.93303L7.37939 11.7506C7.59867 11.9828 7.72185 12.2976 7.72185 12.626C7.72185 12.9543 7.59867 13.2692 7.37939 13.5013C7.16011 13.7335 6.86271 13.8639 6.55261 13.8639C6.24251 13.8639 5.9451 13.7335 5.72583 13.5013L0.342952 7.80218C0.234235 7.68731 0.147983 7.55087 0.0891333 7.40066C0.0302835 7.25046 -7.62939e-06 7.08944 -7.62939e-06 6.92682C-7.62939e-06 6.76421 0.0302835 6.60319 0.0891333 6.45298C0.147983 6.30278 0.234235 6.16634 0.342952 6.05147L5.72583 0.352331C6.17147 -0.119493 6.92202 -0.119493 7.37939 0.364748Z"
                      fill="#DB4444"
                    />
                  </svg>
                )}

                {totalPages.map((pageNum) => (
                  <Link
                    key={pageNum}
                    to={`/collection/${name}?page=${pageNum}&limit=10`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    <span
                      className={`pagination-numbers ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                    >
                      {pageNum}
                    </span>
                  </Link>
                ))}
                {currentPage < totalPages.length && (
                  <svg
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={goToNextPage}
                  >
                    <path
                      d="M0.342961 0.364748C0.234244 0.479616 0.147992 0.616059 0.0891419 0.766264C0.0302921 0.91647 0 1.07749 0 1.2401C0 1.40272 0.0302921 1.56374 0.0891419 1.71395C0.147992 1.86415 0.234244 2.00059 0.342961 2.11546L4.89319 6.93303L0.342961 11.7506C0.123685 11.9828 0.000496575 12.2976 0.000496575 12.626C0.000496575 12.9543 0.123685 13.2692 0.342961 13.5013C0.562237 13.7335 0.859639 13.8639 1.16974 13.8639C1.47985 13.8639 1.77725 13.7335 1.99652 13.5013L7.3794 7.80218C7.48812 7.68731 7.57437 7.55087 7.63322 7.40067C7.69207 7.25046 7.72236 7.08944 7.72236 6.92682C7.72236 6.76421 7.69207 6.60319 7.63322 6.45298C7.57437 6.30278 7.48812 6.16634 7.3794 6.05147L1.99652 0.352331C1.55088 -0.119493 0.800329 -0.119493 0.342961 0.364748Z"
                      fill="#DB4444"
                    />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
      </SideFilterProvider>
    </section>
  );
}

export default CollectionPage;
