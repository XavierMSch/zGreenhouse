import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Greenhouse } from "../models/Greenhouse";
import { GreenhouseLight } from "./canvas/GreenhouseLight";
import PottedPlant from './canvas/PottedPlant';

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [1, 1.5, 2], fov: 45 }}
      className="w-full h-full"
    >
      <GreenhouseLight />
      <Greenhouse />
      <PottedPlant />
      <OrbitControls makeDefault />
      <Environment preset="forest" />
    </Canvas>
  );
}
