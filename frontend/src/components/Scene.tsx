import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Greenhouse } from "./canvas/Greenhouse";
import { EffectComposer } from "@react-three/postprocessing";
import { GreenhouseTemperatureEffects } from "./canvas/GreenhouseTemperaturaEffects";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [1, 1.5, 2], fov: 45 }}
      className="w-full h-full"
      gl={{ stencil: true }}
    >
      <Greenhouse />
      <OrbitControls minDistance={0.2} maxDistance={2} makeDefault />
      <Environment preset="forest" />

      <EffectComposer>
        <GreenhouseTemperatureEffects />
      </EffectComposer>
    </Canvas>
  );
}
