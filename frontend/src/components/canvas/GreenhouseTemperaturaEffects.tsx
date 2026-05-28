import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../../stores/useStore";
import { MathUtils, Vector2 } from "three";
import { ChromaticAberration } from "@react-three/postprocessing";
import type { ChromaticAberrationEffect } from "postprocessing";

const defaultOffset = new Vector2(0, 0);

export const GreenhouseTemperatureEffects = memo(function GreenhouseTemperatureEffects() {
  const aberrationRef = useRef<ChromaticAberrationEffect>(null);

  useFrame((state) => {
    const storeState = useStore.getState();
    const temperature = storeState.isSimulationMode
      ? storeState.sensors.temperature
      : storeState.telemetrySensors.temperature;

    if (aberrationRef.current) {
      const distortionAmount = MathUtils.clamp(
        MathUtils.mapLinear(temperature, 25, 45, 0, 1),
        0,
        1,
      );

      if (distortionAmount > 0) {
        // 1. VELOCIDAD (SPEED): 15 hace que vibre rápido, simulando la turbulencia del aire caliente.
        const SPEED = 20;
        const time = state.clock.elapsedTime * SPEED;

        // 2. DISTANCIA (DISTANCE): 0.0025 es el límite antes de que empiece a lastimar la vista.
        const DISTANCE = 0.002 * distortionAmount;

        // Combinamos ondas para que el movimiento sea turbulento y no un círculo perfecto
        const x = Math.sin(time) * Math.cos(time * 0.5) * DISTANCE;
        const y = Math.cos(time * 0.8) * Math.sin(time * 0.3) * DISTANCE;

        aberrationRef.current.offset.x = x;
        aberrationRef.current.offset.y = y;
      } else {
        aberrationRef.current.offset.x = 0;
        aberrationRef.current.offset.y = 0;
      }
    }
  });

  return <ChromaticAberration ref={aberrationRef} offset={defaultOffset} />;
});
