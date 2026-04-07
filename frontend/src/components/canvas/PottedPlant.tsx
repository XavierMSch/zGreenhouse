import { PLANTS } from '../../configs/PlantsConfig';
import { useStore } from "../../hooks/useStore";
import { Pot } from "../../models/Pot";

export default function PottedPlant() {
  const selectedPlant = useStore((state) => state.selectedPlant);
  const PlantComponent = PLANTS.find((p) => p.name === selectedPlant)?.model ?? null;

  return (
      <>
        <Pot />
        {PlantComponent && <PlantComponent />}
      </>
  );
}
