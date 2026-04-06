import { useStore } from "../../hooks/useStore";

export function GreenhouseLight() {
  const sunlight = useStore((s) => s.sensors.sunlight);

  const intensity = (sunlight / 20); 

  return (
    <group>
      <directionalLight
        position={[5, 10, 5]}
        intensity={intensity}
        color="#fff9e6"
        castShadow
      />
    </group>
  );
}