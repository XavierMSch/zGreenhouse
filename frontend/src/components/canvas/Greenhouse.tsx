import { GreenhouseFrame } from "../../models/GreenhouseFrame";
import { GreenhouseLight } from "../canvas/GreenhouseLight";
import { PottedPlant } from '../canvas/PottedPlant';

export function Greenhouse() {
  return (
    <group>
      <GreenhouseFrame />
      <GreenhouseLight />
      <PottedPlant />
    </group>
  );
}
