import { Clone, useGLTF } from "@react-three/drei";

export function Basil() {
  const { scene } = useGLTF("/3d-models/basil.glb");
  return <Clone object={scene} scale={0.4} position={[0, -0.04, 0]} />;
}

useGLTF.preload("/3d-models/basil.glb");
