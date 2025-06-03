import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

const Planet3D = ({ 
  planet, 
  position, 
  onClick, 
  isActive, 
  scale = 1 
}) => {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += isActive ? 0.005 : 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.05;
    }
    
    if (groupRef.current) {
      if (isActive) {
                groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
        groupRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      } else {
        groupRef.current.scale.setScalar(scale * (hovered ? 1.1 : 1));
      }
    }
  });

  const baseSize = planet.size / (isActive ? 80 : 100);

  return (
    <group 
      ref={groupRef}
      position={position}
    >
      <Sphere
        ref={meshRef}
        args={[baseSize, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhongMaterial
          color={planet.color}
          emissive={planet.glowColor}
          emissiveIntensity={isActive ? 0.4 : hovered ? 0.2 : 0.1}
          shininess={100}
        />
      </Sphere>
      
      <Sphere args={[baseSize * 1.1, 32, 32]}>
        <meshPhongMaterial
          color={planet.glowColor}
          transparent
          opacity={isActive ? 0.4 : 0.2}
          emissive={planet.glowColor}
          emissiveIntensity={isActive ? 0.3 : 0.1}
        />
      </Sphere>

      {planet.hasRings && (
        <Ring
          args={[baseSize * 1.3, baseSize * 1.8, 64]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color={planet.ringColor}
            transparent
            opacity={isActive ? 0.8 : 0.6}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}
    </group>
  );
};

export default Planet3D;