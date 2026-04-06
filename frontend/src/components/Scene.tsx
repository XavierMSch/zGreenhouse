import { Canvas } from "@react-three/fiber";
import { useStore } from "../hooks/useStore";
import { OrbitControls, Environment } from "@react-three/drei";
import { Greenhouse } from "../models/Greenhouse";
import { Pot } from "../models/Pot";
import { Basil } from "../models/Basil";
import { Mint } from "../models/Mint";
import { Rosemary } from "../models/Rosemary";

export default function Scene() {
  const selectedPlant = useStore((state) => state.selectedPlant);

  return (
    <Canvas
      camera={{ position: [1, 1.5, 2], fov: 45 }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 1, 0]} intensity={5} />
      <Greenhouse />
      <Pot />
      {selectedPlant === "rosemary" && <Rosemary />}
      {selectedPlant === "basil" && <Basil />}
      {selectedPlant === "mint" && <Mint />}
      <OrbitControls makeDefault />
      <Environment preset="forest" />
    </Canvas>
  );
}
