import { useGLTF } from "@react-three/drei";

export function Chrizantemos() {
  const { scene } = useGLTF("/3d-models/blue_chrizantemos.glb");
  return (
    <primitive object={scene} scale={0.4} position={[0.01, 0.03, -0.01]} />
  );
}
