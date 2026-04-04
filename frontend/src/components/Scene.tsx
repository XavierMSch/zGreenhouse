import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Greenhouse } from "../models/Greenhouse";
import { Pot } from "../models/Pot";
import { Chrizantemos } from "../models/Chrizantemos";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [1, 1.5, 2], fov: 45 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 1, 0]} intensity={5} />
      <Greenhouse />
      <Pot />
      <Chrizantemos />
      <OrbitControls makeDefault />
      <Environment preset="forest" />
    </Canvas>
  );
}
