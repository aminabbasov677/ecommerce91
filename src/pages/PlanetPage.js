import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Rocket, ArrowLeft, ArrowRight } from 'lucide-react';
import SolarSystem3D from '../components/SolarSystem3D';
import './PlanetPage.css';

const planets = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#8C7853',
    size: 40,
    distance: 120,
    orbitSpeed: 0.02,
    description: 'Closest planet to the Sun, scorching hot surface',
    temperature: '427°C',
    atmosphere: 'None',
    moons: 0,
    glowColor: '#FFA500',
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#FFC649',
    size: 50,
    distance: 160,
    orbitSpeed: 0.015,
    description: 'Hottest planet with thick toxic atmosphere',
    temperature: '462°C',
    atmosphere: 'CO₂',
    moons: 0,
    glowColor: '#FFD700',
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#6B93D6',
    size: 55,
    distance: 200,
    orbitSpeed: 0.01,
    description: 'Our beautiful blue home planet',
    temperature: '15°C',
    atmosphere: 'N₂, O₂',
    moons: 1,
    glowColor: '#00BFFF',
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#CD5C5C',
    size: 45,
    distance: 240,
    orbitSpeed: 0.008,
    description: 'The red planet, future home for humanity',
    temperature: '-65°C',
    atmosphere: 'CO₂',
    moons: 2,
    glowColor: '#FF4500',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#D8CA9D',
    size: 80,
    distance: 320,
    orbitSpeed: 0.005,
    description: 'Gas giant with the great red spot',
    temperature: '-110°C',
    atmosphere: 'H₂, He',
    moons: 79,
    glowColor: '#DAA520',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#FAD5A5',
    size: 75,
    distance: 400,
    orbitSpeed: 0.003,
    description: 'Beautiful ringed gas giant',
    temperature: '-140°C',
    atmosphere: 'H₂, He',
    moons: 83,
    glowColor: '#F4A460',
    hasRings: true,
    ringColor: '#E6E6FA',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#4FD0E7',
    size: 65,
    distance: 480,
    orbitSpeed: 0.002,
    description: 'Ice giant tilted on its side',
    temperature: '-195°C',
    atmosphere: 'H₂, He, CH₄',
    moons: 27,
    glowColor: '#40E0D0',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#4B70DD',
    size: 62,
    distance: 560,
    orbitSpeed: 0.001,
    description: 'Windy ice giant at the edge of our system',
    temperature: '-200°C',
    atmosphere: 'H₂, He, CH₄',
    moons: 14,
    glowColor: '#1E90FF',
  },
];

const PlanetPage = () => {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(2); // Start with Earth

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setCurrentPlanetIndex(prev => (prev + 1) % planets.length);
      } else {
        setCurrentPlanetIndex(prev => (prev - 1 + planets.length) % planets.length);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
    setShowConfirmation(true);
  };

  const handleConfirmSelection = () => {
    if (selectedPlanet) {
      window.dispatchEvent(new CustomEvent('planetSelected', {
        detail: { planetName: selectedPlanet.name }
      }));
      navigate('/checkout', { 
        state: { 
          step: 2, 
          from: '/planet-selection', 
          planet: selectedPlanet.name 
        } 
      });
    }
  };

  const handleBack = () => {
    navigate('/checkout', { state: { step: 2, from: '/planet-selection' } });
  };

  const nextPlanet = () => {
    setCurrentPlanetIndex(prev => (prev + 1) % planets.length);
  };

  const prevPlanet = () => {
    setCurrentPlanetIndex(prev => (prev - 1 + planets.length) % planets.length);
  };

  const currentPlanet = planets[currentPlanetIndex];

  return (
    <div className="planet-page-3d">
      <div className="planet-header-3d">
        <motion.button
          className="back-button"
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
          Back
        </motion.button>

        <motion.h1
          className="cosmic-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Choose Your Destination
        </motion.h1>
        
        <motion.p
          className="cosmic-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Scroll to navigate • Click to select
        </motion.p>
      </div>

      <div className="solar-system-3d">
        <SolarSystem3D
          planets={planets}
          onPlanetSelect={handlePlanetSelect}
          currentPlanetIndex={currentPlanetIndex}
        />
      </div>

      <div className="navigation-controls">
        <motion.button
          className="nav-button prev"
          onClick={prevPlanet}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        <div className="planet-info">
          <motion.h3
            key={currentPlanet.id}
            style={{ color: currentPlanet.glowColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentPlanet.name}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {currentPlanet.temperature}
          </motion.p>
        </div>

        <motion.button
          className="nav-button next"
          onClick={nextPlanet}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight size={24} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showConfirmation && selectedPlanet && (
          <motion.div
            className="confirmation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className="selected-planet-preview"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${selectedPlanet.color}dd)`,
                  boxShadow: `0 0 30px ${selectedPlanet.glowColor}`,
                  borderColor: selectedPlanet.glowColor,
                }}
                animate={{
                  boxShadow: [
                    `0 0 30px ${selectedPlanet.glowColor}`,
                    `0 0 50px ${selectedPlanet.glowColor}`,
                    `0 0 30px ${selectedPlanet.glowColor}`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <h3>Destination Selected</h3>
              <motion.h2
                style={{ color: selectedPlanet.glowColor }}
                animate={{
                  textShadow: [
                    `0 0 10px ${selectedPlanet.glowColor}`,
                    `0 0 20px ${selectedPlanet.glowColor}`,
                    `0 0 10px ${selectedPlanet.glowColor}`,
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {selectedPlanet.name}
              </motion.h2>
              
              <div className="planet-details">
                <p><strong>Temperature:</strong> {selectedPlanet.temperature}</p>
                <p><strong>Atmosphere:</strong> {selectedPlanet.atmosphere}</p>
                <p><strong>Moons:</strong> {selectedPlanet.moons}</p>
                <p>{selectedPlanet.description}</p>
              </div>

              <div className="confirmation-buttons">
                <motion.button
                  className="cancel-btn"
                  onClick={() => setShowConfirmation(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="confirm-btn"
                  style={{
                    background: `linear-gradient(45deg, ${selectedPlanet.glowColor}, ${selectedPlanet.color})`,
                  }}
                  onClick={handleConfirmSelection}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="mr-2" size={20} />
                  Confirm Destination
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanetPage;