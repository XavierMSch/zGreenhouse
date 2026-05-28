import { PLANTS } from "../../configs/PlantsConfig";
import { useStore } from "../../stores/useStore";
import { Pot } from "../../models/Pot";

export function PottedPlant() {
  const selectedPlant = useStore((state) => state.selectedPlant);
  const PlantComponent =
    PLANTS.find((p) => p.name === selectedPlant)?.model ?? null;

  return (
    <group>
      <Pot />
      {PlantComponent && <PlantComponent />}
    </group>
  );
}
