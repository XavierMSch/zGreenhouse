export function calculateVpd(temperature: number, humidity: number): number {
  const saturation =
    0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
  return Number((saturation * (1 - humidity / 100)).toFixed(2));
}
