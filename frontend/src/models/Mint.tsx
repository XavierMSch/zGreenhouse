import { Clone, useGLTF } from "@react-three/drei";

export function Mint() {
  const { scene } = useGLTF("/3d-models/mint.glb");
  return <Clone object={scene} scale={0.4} position={[0, -0.05, 0]} />;
}
