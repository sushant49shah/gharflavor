import "@radix-ui/themes/styles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./layout/Layout";
import Products from "./pages/ProductsPage";
import About from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import Contact from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Review from "./pages/Review";
import PageNotFound from "./pages/PageNotFound";
import AdminPage from "./pages/admin/AdminPage";
import OrderDetailPage from "./components/OrderDetailPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <div className="min-h-screen selection:bg-blue-400 selection:text-white flex flex-col">
        <ScrollToTop />
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/review" element={<Review />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
