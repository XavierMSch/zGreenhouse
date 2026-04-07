import { Clone, useGLTF } from "@react-three/drei";

export function Rosemary() {
  const { scene } = useGLTF("/3d-models/rosemary.glb");
  return <Clone object={scene} scale={0.4} position={[0, -0.05, 0]} />;
}
