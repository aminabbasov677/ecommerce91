import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CosmicBackground = () => {
  const ref = useRef(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(3000);
    const colors = new Float32Array(3000);
    
    for (let i = 0; i < 1000; i++) {
      const r = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const colorIntensity = Math.random();
      colors[i * 3] = colorIntensity;
      colors[i * 3 + 1] = colorIntensity * 0.8 + 0.2;
      colors[i * 3 + 2] = 1;
    }
            
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.0005;
      ref.current.rotation.y = state.clock.elapsedTime * 0.0008;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} frustumCulled={false}>
      <PointMaterial
        transparent
        size={0.02}
        sizeAttenuation={true}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default CosmicBackground;