import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense } from "react";
import "./App.css";
import "./index.css";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/register" || location.pathname === "/login";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="*" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </Suspense>
      {!isAuthPage && <Footer />}
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
