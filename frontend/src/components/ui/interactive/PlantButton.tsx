import { useStore } from "../../../stores/useStore";
import { setActivePlantId } from "../../../lib/plantApi";
import type { PlantData } from "../../../interfaces/PlantData";

interface PlantButtonProps {
  data: PlantData;
}

export default function PlantButton(props: PlantButtonProps) {
  const plantData = props.data;
  const selectedPlant = useStore((s) => s.selectedPlant);
  const setSelectedPlant = useStore((s) => s.setSelectedPlant);
  const isSimulationMode = useStore((s) => s.isSimulationMode);
  const active = selectedPlant === plantData.name;
  return (
    <button
      onClick={() => {
        setSelectedPlant(plantData.name);
        if (!isSimulationMode) {
          void setActivePlantId(plantData.id).catch((error) => {
            console.error("Failed to update active plant", error);
          });
        }
      }}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
            ${
              active
                ? "bg-emerald-500/20 border-emerald-400/50"
                : "bg-white/5 border-transparent hover:border-emerald-400/30"
            }`}
    >
      <span className="text-3xl">{plantData.emoji}</span>
      <span
        className={`text-[10px] font-bold ${active ? "text-emerald-400" : "text-slate-400"}`}
      >
        {plantData.label.toUpperCase()}
      </span>
    </button>
  );
}
