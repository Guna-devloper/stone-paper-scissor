import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useCart } from "../Context/CartContext";
import Collapse from "bootstrap/js/dist/collapse";

function Navbar() {
  const [user, setUser] = useState(null);
  const [scrollDir, setScrollDir] = useState("down");
  const navigate = useNavigate();
  const { cart, cartBump } = useCart();
  const collapseRef = useRef(null);
  const collapseInstance = useRef(null);
  const lastScrollY = useRef(window.scrollY);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // Collapse menu init
  useEffect(() => {
    if (collapseRef.current) {
      collapseInstance.current = new Collapse(collapseRef.current, {
        toggle: false,
      });
    }
  }, []);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY - lastScrollY.current > 5) {
        setScrollDir("up");
      } else if (currentY < lastScrollY.current && lastScrollY.current - currentY > 5) {
        setScrollDir("down");
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
    collapseInstance.current?.hide();
  };

  const handleToggle = () => {
    collapseInstance.current?.toggle();
  };

  const handleClose = () => {
    collapseInstance.current?.hide();
  };

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg sticky-top"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          zIndex: 1000,
        }}
      >
        <div className="container-fluid px-3">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/" onClick={handleClose}>
            <img
              src="/sps-logo-removebg-preview.png"
              alt="Logo"
              width="40"
              height="40"
              className="me-2"
            />
            <span className="fw-bold text-primary d-inline d-md-none">SPS</span>
            <span className="fw-bold text-primary d-none d-md-inline">
              Stone Paper Scissor
            </span>
          </Link>

          {/* Cart & Toggle */}
          <div className="d-flex align-items-center">
            <Link className="nav-link position-relative me-2" to="/cart" onClick={handleClose}>
              <span
                className={`fs-4 ${cartBump ? "cart-bump" : ""}`}
                role="img"
                aria-label="cart"
              >
                🛒
              </span>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarMobile"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={handleToggle}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Collapsible menu */}
          <div
            className="collapse navbar-collapse mt-2 mt-lg-0"
            id="navbarMobile"
            ref={collapseRef}
          >
            <ul className="navbar-nav ms-auto align-items-start gap-2 gap-lg-3">
              <li className="nav-item">
                <Link className="nav-link text-dark fw-semibold" to="/shop" onClick={handleClose}>
                  🛍 Shop
                </Link>
              </li>

              {!user ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-primary btn-sm w-100"
                      to="/login"
                      onClick={handleClose}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-primary btn-sm w-100"
                      to="/signup"
                      onClick={handleClose}
                    >
                      Signup
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown w-100">
                  <span
                    className="nav-link dropdown-toggle text-dark fw-semibold"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ cursor: "pointer" }}
                  >
                    👤 {user.email.split("@")[0]}
                  </span>
                  <ul className="dropdown-menu w-100">
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={handleClose}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders" onClick={handleClose}>
                        Orders
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Bottom Mobile Nav - Auto Hide on Scroll Up */}
      <div
        className={`d-lg-none d-flex justify-content-around fixed-bottom py-2 border-top transition-bottom ${
          scrollDir === "up" ? "hide-navbar" : ""
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          zIndex: 999,
          transition: "transform 0.3s ease",
        }}
      >
        <Link to="/" className="text-center text-dark" onClick={handleClose}>
          <i className="bi bi-house-door fs-4"></i>
          <br />
          <small>Home</small>
        </Link>
        <Link to="/shop" className="text-center text-dark" onClick={handleClose}>
          <i className="bi bi-bag fs-4"></i>
          <br />
          <small>Shop</small>
        </Link>
        <Link to="/cart" className="text-center text-dark position-relative" onClick={handleClose}>
          <i className={`bi bi-cart fs-4 ${cartBump ? "cart-bump" : ""}`}></i>
          {cartCount > 0 && (
            <span className="position-absolute top-0 start-50 badge rounded-pill bg-danger">
              {cartCount}
            </span>
          )}
          <br />
          <small>Cart</small>
        </Link>
        {user ? (
          <Link to="/profile" className="text-center text-dark" onClick={handleClose}>
            <i className="bi bi-person-circle fs-4"></i>
            <br />
            <small>Account</small>
          </Link>
        ) : (
          <Link to="/login" className="text-center text-dark" onClick={handleClose}>
            <i className="bi bi-box-arrow-in-right fs-4"></i>
            <br />
            <small>Login</small>
          </Link>
        )}
      </div>

      {/* Inline CSS class to hide bottom nav */}
      <style>{`
        .hide-navbar {
          transform: translateY(100%);
        }
      `}</style>
    </>
  );
}

export default Navbar;
