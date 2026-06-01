import { Mask } from "@react-three/drei";
import { MathUtils } from "three";
import { GreenhouseFrame } from "../../models/GreenhouseFrame";
import { Snowflakes } from "../../models/effects/Snowflakes";
import { useStore } from "../../stores/useStore";
import { PottedPlant } from "../canvas/PottedPlant";
import { GreenhouseTemperature } from "./GreenhouseTemperature";

export function Greenhouse() {
  const temperature = useStore((state) =>
    state.isSimulationMode
      ? state.sensors.temperature
      : state.telemetrySensors.temperature,
  );

  const SNOW_START_TEMP = 5;
  const SNOW_FULL_TEMP = -5;

  const snowIntensity = MathUtils.clamp(
    MathUtils.mapLinear(temperature, SNOW_START_TEMP, SNOW_FULL_TEMP, 0, 1),
    0,
    1,
  );

  return (
    <group>
      <GreenhouseFrame />

      <Mask id={1} position={[0.1, 0.2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </Mask>

      <Snowflakes intensity={snowIntensity} maskId={1} />
      <GreenhouseTemperature />
      <PottedPlant />
    </group>
  );
}
