import { useGLTF } from "@react-three/drei";

export function GreenhouseFrame() {
  const { scene } = useGLTF("/3d-models/greenhouse.glb");
  return <primitive object={scene} scale={1} position={[0.1, -0.2, 0]} />;
}

useGLTF.preload("/3d-models/greenhouse.glb");
