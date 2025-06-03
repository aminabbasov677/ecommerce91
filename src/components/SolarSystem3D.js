import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Planet3D from './Planet3D';
import Sun3D from './Sun3D';
import CosmicBackground from './CosmicBackground';

const SolarSystem3D = ({ 
  planets, 
  onPlanetSelect, 
  currentPlanetIndex 
}) => {
  const cameraRef = useRef(null);

  const getMainPlanetPosition = () => {
    return [0, 0, 0];
  };

  const getBackgroundPlanetPosition = (index, currentIndex) => {
    if (index === currentIndex) return getMainPlanetPosition();
    
    const relativeIndex = index - currentIndex;
    const angle = (relativeIndex / planets.length) * Math.PI * 2;
    const distance = 8;
    
    return [
      Math.cos(angle) * distance,
      Math.sin(relativeIndex * 0.3) * 2,
      Math.sin(angle) * distance
    ];
  };

  const getPlanetScale = (index, currentIndex) => {
    if (index === currentIndex) {
      return 3.0;
    }
    return 0.8;
  };

  return (
    <Canvas style={{ width: '100%', height: '100vh', background: '#000000' }}>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2, 8]}
        fov={60}
      />
      
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#ffffff"
      />
      <pointLight
        position={[-10, -10, -5]}
        intensity={0.4}
        color="#4169E1"
      />
      
      <CosmicBackground />
      
      <group position={[15, 5, -20]}>
        <Sun3D />
      </group>
      
      {planets.map((planet, index) => (
        <Planet3D
          key={planet.id}
          planet={planet}
          position={getBackgroundPlanetPosition(index, currentPlanetIndex)}
          onClick={() => onPlanetSelect(planet)}
          isActive={index === currentPlanetIndex}
          scale={getPlanetScale(index, currentPlanetIndex)}
        />
      ))}
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={15}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.2}
      />
    </Canvas>
  );
};

export default SolarSystem3D;