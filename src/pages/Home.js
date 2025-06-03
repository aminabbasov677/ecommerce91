import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const { dispatch } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const productsPerPage = 9;

  useEffect(() => {
    // Set initial page from location state
    if (location.state?.page) {
      setCurrentPage(location.state.page);
    }
    // Set initial category from location state
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  const {
    data: categoriesData = [],
    isLoading: categoriesLoadingData,
    error: categoriesErrorData,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetch("https://fakestoreapi.com/products/categories").then((res) =>
        res.json()
      ),
  });

  const {
    data: productsData = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch("https://fakestoreapi.com/products").then(res => res.json()),
  });

  useEffect(() => {
    setProducts(productsData);
    setLoading(productsLoading);
    setError(productsError);
  }, [productsData, productsLoading, productsError]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon" />);
      }
    }
    return stars;
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products?.filter(product => product.category === selectedCategory);
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Update URL state when page changes
      navigate('/', { 
        state: { page: pageNumber, category: selectedCategory },
        replace: true
      });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // Update URL state when category changes
    navigate('/', { 
      state: { page: 1, category },
      replace: true
    });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    appendDots: (dots) => (
      <div style={{ position: 'absolute', bottom: '-40px', width: '100%' }}>
        <ul className="slick-dots-custom">{dots}</ul>
      </div>
    ),
    customPaging: () => <div className="slick-dot-custom" />,
  };

  const banners = [
    "https://www.digiseller.ru/preview/1088750/p1_3690821_b9d2a549.jpg",
    "https://i.ytimg.com/vi/aqTtwGwwOhA/maxresdefault.jpg",
    "https://i.ytimg.com/vi/cTDU-u84x5Q/maxresdefault.jpg",
    "https://i.ytimg.com/vi/D_oPnckCSUI/maxresdefault.jpg?7857057827",
    "https://i.ytimg.com/vi/lKh2pHCbtno/maxresdefault.jpg",
    "https://i.ytimg.com/vi/3WvQvmCEX4w/maxresdefault.jpg",
  ];

  if (loading || categoriesLoadingData) {
    return (
      <div className="loading-container glass-effect">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || categoriesErrorData) {
    return (
      <div className="error-container glass-effect">
        <p className="neon-effect">
          Error: {error?.message || categoriesErrorData?.message}
        </p>
      </div>
    );
  }

  return (
    <div className={`home-container ${isDarkMode ? "dark" : "light"}`}>
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="page-title gradient-text"
      >
        Welcome to Orbix
      </motion.h1>
      <motion.div
        className="slider-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Slider {...sliderSettings}>
          {banners.map((banner, index) => (
            <div key={index} className="slider-item">
              <img src={banner} alt={`Banner ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </motion.div>
      <motion.div
        className="category-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="category-buttons">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
            aria-pressed={selectedCategory === "all"}
          >
            All Categories
          </motion.button>
          {categoriesData.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`category-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryChange(category)}
              aria-pressed={selectedCategory === category}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <div className="products-grid">
        {currentProducts?.map((product) => (
          <motion.div
            key={product.id}
            className="product-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <div className="product-image">
              <Link 
                to={`/product/${product.id}`}
                state={{ from: 'home', page: currentPage }}
              >
                <img src={product.image} alt={product.title} />
              </Link>
            </div>
            <div className="content">
              <Link 
                to={`/product/${product.id}`}
                state={{ from: 'home', page: currentPage }}
              >
                <h3 className="product-title neon-effect">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
              </Link>
              <div className="rating-favorite-container">
                <div className="star-rating">
                  {renderStars(product.rating.rate)}
                </div>
                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(product)}
                  aria-label={favorites.some(fav => fav.id === product.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <FaHeart className={`heart-icon ${favorites.some(fav => fav.id === product.id) ? "filled" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="pagination-container">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </motion.button>
        <span className="pagination-current" aria-live="polite">
          {currentPage} / {totalPages}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`pagination-btn ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}

export default Home;
