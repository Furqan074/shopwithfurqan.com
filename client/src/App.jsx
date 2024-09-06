import { isTablet, isBrowser } from "react-device-detect";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/css/index.css";
// components
import TopLoadingBar from "react-top-loading-bar";
import ScrollToTopAndLoader from "./components/ScrollToTopAndLoader.jsx";
import Header from "./components/Header.jsx";
import HeaderMobile from "./components/HeaderMobile.jsx";
import BreadCrumbs from "./components/BreadCrumbs.jsx";
import Drawer from "./components/Drawer.jsx";
import Footer from "./components/Footer.jsx";
import BottomIcons from "./components/BottomIcons.jsx";

// pages
import HomePage from "./pages/HomePage.jsx";
import WishPage from "./pages/WishPage.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import RecoverAccount from "./pages/RecoverAccount.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import Account from "./pages/Account.jsx";
import Orders from "./pages/Orders.jsx";
import Checkout from "./pages/Checkout.jsx";
import ResetPass from "./pages/ResetPass.jsx";
import { useRef } from "react";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";

function App() {
  const loadingBarRef = useRef(null);
  return (
    <Router>
      <TopLoadingBar color="#db4444" ref={loadingBarRef} />
      <ScrollToTopAndLoader loadingBarRef={loadingBarRef} />
      {isBrowser || isTablet ? <Header /> : <HeaderMobile />}
      <Drawer />
      <BreadCrumbs />
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/login" Component={SignIn} />
        <Route path="/register" Component={SignUp} />
        <Route path="/recover" Component={RecoverAccount} />
        <Route path="/reset/:resetToken" Component={ResetPass} />
        <Route path="/wishlist" Component={WishPage} />
        <Route path="/checkout" Component={Checkout} />
        <Route path="/confirmation" Component={CheckoutSuccess} />
        <Route path="/profile" Component={Account} />
        <Route path="/orders" Component={Orders} />
        <Route path="/products/:name" Component={ProductPage} />
        <Route path="/collection/:name" Component={CollectionPage} />
        <Route path="*" Component={PageNotFound} />
      </Routes>
      <BottomIcons />
      <Footer />
    </Router>
  );
}

export default App;
