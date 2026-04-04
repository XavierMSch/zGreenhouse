import { useGLTF } from "@react-three/drei";

export function Pot() {
  const { scene } = useGLTF("/3d-models/plant_pot.glb");
  return <primitive object={scene} scale={0.35} position={[0, -0.19, 0]} />;
}
