import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Sun3D = () => {
  const meshRef = useRef(null);
  const coronaRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      const pulseFactor = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(pulseFactor);
    }
    
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.002;
      const coronaPulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      coronaRef.current.scale.setScalar(coronaPulse);
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[0.8, 32, 32]}>
        <meshPhongMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={0.8}
          shininess={100}
        />
      </Sphere>
      
      <Sphere ref={coronaRef} args={[1.2, 32, 32]}>
        <meshPhongMaterial
          color="#FF6347"
          transparent
          opacity={0.3}
          emissive="#FF4500"
          emissiveIntensity={0.5}
        />
      </Sphere>
    
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#FFD700"
        distance={50}
      />
    </group>
  );
};

export default Sun3D;