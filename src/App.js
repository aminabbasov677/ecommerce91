import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TrackingProvider } from "./context/TrackingContext";
import { CardProvider } from './context/CardContext';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Tracking from "./pages/Tracking";
import FavoritesPage from "./pages/FavoritesPage";
import AIChat from "./pages/AIChat";
import CardPage from "./pages/CardPage.js";
import Checkout from "./pages/Checkout.js";
import DailyActivityCharts from "./pages/DailyActivityCharts.js";
import ProductViewStatistics from "./pages/ProductViewStatistics.js";
import TimeSpentStatistics from "./pages/TimeSpentStatistics.js";
import PlanetPage from "./pages/PlanetPage.js";
import "./App.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          color: 'white', 
          background: '#1a1a1a',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#00ffc3',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const isFetching = useIsFetching();
  const location = useLocation();

  const particleOptions = {
    particles: {
      number: { value: 60 },
      color: { value: ["#00f3ff", "#9d00ff", "#39ff14", "#ff00ff"] },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 4 }, random: true },
      move: {
        enable: true,
        speed: { min: 0.3, max: 0.8 },
        direction: "none",
        random: true,
        outModes: { default: "out" },
      },
      opacity: { value: { min: 0.3, max: 0.6 }, random: true },
      links: {
        enable: true,
        distance: 150,
        color: "#00f3ff",
        opacity: 0.3,
        width: 1,
      },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 200, links: { opacity: 0.5 } },
        push: { quantity: 4 },
      },
    },
    background: { color: "transparent" },
    retina_detect: true,
  };

  const particlesInit = async (engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error('Failed to initialize particles:', error);
    }
  };

  const isChatPage = location.pathname === "/chat";
  const isSearchPage = location.pathname === "/search";
  const isCardPage = location.pathname === "/card";
  const showFooter = !(isChatPage || isSearchPage || isCardPage);

  return (
    <div className="app-container">
      <Particles id="tsparticles" init={particlesInit} options={particleOptions} />
      <Navbar />
      <main className="main-content">
        {isFetching ? <Loading /> : null}
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/card" element={<CardPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/Checkout" element={<Checkout />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/dailyActivityCharts" element={<DailyActivityCharts />} />
            <Route path="/productViewStatistics" element={<ProductViewStatistics />} />
            <Route path="/timeSpentStatistics" element={<TimeSpentStatistics />} />
            <Route path="/planet-selection" element={<PlanetPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {showFooter && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TrackingProvider>
              <CartProvider>
                <CardProvider>
                  <FavoritesProvider>
                    <Router>
                      <ScrollToTop />
                      <AppContent />
                    </Router>
                  </FavoritesProvider>
                </CardProvider>
              </CartProvider>
            </TrackingProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;