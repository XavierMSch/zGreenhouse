import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Greenhouse } from "../models/Greenhouse";
import { Pot } from "../models/Pot";
import { Chrizantemos } from "../models/Chrizantemos";
import { GreenhouseLight } from './canvas/GreenhouseLight';

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [1, 1.5, 2], fov: 45 }}
      className="w-full h-full"
    >
      <GreenhouseLight />
      <Greenhouse />
      <Pot />
      <Chrizantemos />
      <OrbitControls makeDefault />
      <Environment preset="forest" />
    </Canvas>
  );
}
