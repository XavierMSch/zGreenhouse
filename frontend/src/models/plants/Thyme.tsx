import { Clone, useGLTF } from "@react-three/drei";

export function Thyme() {
  const { scene } = useGLTF("/3d-models/thyme.glb");
  return <Clone object={scene} scale={0.4} position={[0, -0.05, 0]} />;
}

useGLTF.preload("/3d-models/thyme.glb");
