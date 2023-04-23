import { useGLTF, OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  Select,
  Selection,
  Glitch,
  Pixelation
} from "@react-three/postprocessing";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import CanvasLoader from "../Loader";
import { GlitchMode } from "postprocessing";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./gaming_desktop/scene.gltf");
  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <pointLight intensity={1} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.55 : 0.65}
        position={isMobile ? [0, -3, -2.2] : [0, -3, -1]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{
        preserveDrawingBuffer: true,
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Selection>
          <Select enabled>
            <Computers isMobile={isMobile} />
          </Select>
          <EffectComposer>
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.9}
              intensity={0.5}
              height={300}
            />
            <Glitch
              delay={[1.5, 3.5]}
              duration={[0.6, 1.0]}
              strength={[0.3, 0.7]}
              mode={GlitchMode.SPORADIC}
              active
              ratio={0.9}
            />
            {/* <Pixelation granularity={5} /> */}
          </EffectComposer>
        </Selection>
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
