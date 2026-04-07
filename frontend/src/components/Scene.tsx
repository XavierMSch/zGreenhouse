import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Greenhouse } from './canvas/Greenhouse';

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [1, 1.5, 2], fov: 45 }}
      className="w-full h-full"
    >
      <Greenhouse />
      <OrbitControls minDistance={0.2} maxDistance={2} makeDefault />
      <Environment preset="forest" />
    </Canvas>
  );
}
