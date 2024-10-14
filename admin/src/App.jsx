import "./index.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import UpdateOrder from "./components/UpdateOrder";
import CustomersTable from "./components/CustomersTable";
import CategoriesTable from "./components/CategoriesTable";
import CreateProduct from "./components/CreateProduct";
import UpdateProduct from "./components/UpdateProduct";
import CreateCategory from "./components/CreateCategory";
import UpdateCategory from "./components/UpdateCategory";
import BannersTable from "./components/BannersTable";
import CreateBanner from "./components/CreateBanner";
import UpdateBanner from "./components/UpdateBanner";
import LoginPage from "./components/LoginPage";
import CreateSale from "./components/CreateSale";
const PageNotFound = () => {
  document.title = "404 page not found | Shopwithfurqan";
  return (
    <h1 className="text-center capitalize">
      This page does not exists go{" "}
      <Link to="/" className="text-sky-500">
        Home
      </Link>
    </h1>
  );
};
import { Toaster } from "@/components/ui/toaster";
import Cookies from "universal-cookie";
const cookies = new Cookies();

import { useState, useEffect } from "react";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAuthorization = () => {
    const adminToken = cookies.get("adminToken");
    if (adminToken) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    checkAuthorization();
    const intervalId = setInterval(checkAuthorization, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {isAuthorized ? (
        <Router>
          <Header />
          <Toaster />
          <main className="flex-1 justify-center p-4">
            <Routes>
              <Route path="/orders" Component={OrdersTable} />
              <Route path="/orders/update/:id" Component={UpdateOrder} />
              <Route path="/products" Component={ProductsTable} />
              <Route path="/customers" Component={CustomersTable} />
              <Route path="/banners" Component={BannersTable} />
              <Route path="/categories" Component={CategoriesTable} />
              <Route path="/sale/create" Component={CreateSale} />
              <Route path="/products/create" Component={CreateProduct} />
              <Route path="/products/update/:id" Component={UpdateProduct} />
              <Route path="/categories/create" Component={CreateCategory} />
              <Route path="/categories/update/:id" Component={UpdateCategory} />
              <Route path="/banners/create" Component={CreateBanner} />
              <Route path="/banners/update/:id" Component={UpdateBanner} />
              <Route path="*" Component={PageNotFound} />
            </Routes>
          </main>
        </Router>
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export default App;
