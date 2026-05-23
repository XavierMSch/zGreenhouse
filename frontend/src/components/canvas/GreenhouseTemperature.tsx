import { useStore } from "../../hooks/useStore";
import { Color } from "three";

const temperatureStops = [
  { temp: -15, color: new Color("#1a3359") },
  { temp: 0, color: new Color("#4da6ff") },
  { temp: 7, color: new Color("#b3e6ff") },
  { temp: 15, color: new Color("#ffffff") },
  { temp: 22, color: new Color("#ffffe6") },
  { temp: 28, color: new Color("#ffe6b3") },
  { temp: 35, color: new Color("#ffaa80") },
  { temp: 45, color: new Color("#ff6666") },
];

function getTemperatureColor(value: number): Color {
  if (value <= temperatureStops[0].temp) return temperatureStops[0].color;
  if (value >= temperatureStops[temperatureStops.length - 1].temp)
    return temperatureStops[temperatureStops.length - 1].color;

  let startIdx = 0;
  for (let i = 0; i < temperatureStops.length - 1; i++) {
    if (
      value >= temperatureStops[i].temp &&
      value < temperatureStops[i + 1].temp
    ) {
      startIdx = i;
      break;
    }
  }

  const startStop = temperatureStops[startIdx];
  const endStop = temperatureStops[startIdx + 1];

  const range = endStop.temp - startStop.temp;
  const factor = (value - startStop.temp) / range;

  return new Color().copy(startStop.color).lerp(endStop.color, factor);
}

export function GreenhouseTemperature() {
  const temperature = useStore((s) =>
    s.isSimulationMode ? s.sensors.temperature : s.telemetrySensors.temperature,
  );
  const color = getTemperatureColor(temperature);

  return (
    <group>
      {/* Luz puntual más sutil */}
      <pointLight
        position={[0, 1, 0]}
        intensity={temperature > 30 || temperature < 5 ? 10 : 5} // Menos intensa
        color={color}
        distance={4}
        decay={2}
      />

      {/* 2. NIEBLA AJUSTADA: args={[color, near, far]} 
          - near = 2.5: La niebla NO afecta lo que esté a menos de 2.5 de distancia (el vidrio frontal).
          - far = 12: La niebla se difumina mucho más suavemente hacia el fondo. */}
      <fog attach="fog" args={[color, 2.5, 12]} />
    </group>
  );
}
