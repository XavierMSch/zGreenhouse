import { useEffect } from "react";
import Scene from "./components/Scene";
import { HUDLayout } from "./components/ui/HUDLayout";
import { PLANTS } from "./configs/PlantsConfig";
import { useStore } from "./hooks/useStore";
import { getActivePlantId } from "./lib/plantApi";

export default function App() {
  const setSelectedPlant = useStore((state) => state.setSelectedPlant);
  const isSimulationMode = useStore((state) => state.isSimulationMode);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const activePlantId = await getActivePlantId();
      if (!isMounted || activePlantId == null) {
        return;
      }

      const activePlant = PLANTS.find((plant) => plant.id === activePlantId);
      if (activePlant) {
        setSelectedPlant(activePlant.name);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setSelectedPlant]);

  useEffect(() => {
    if (isSimulationMode) {
      return;
    }

    let isMounted = true;

    void (async () => {
      const activePlantId = await getActivePlantId();
      if (!isMounted || activePlantId == null) {
        return;
      }

      const activePlant = PLANTS.find((plant) => plant.id === activePlantId);
      if (activePlant) {
        setSelectedPlant(activePlant.name);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isSimulationMode, setSelectedPlant]);

  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0">
        <Scene />
      </div>

      <HUDLayout />
    </div>
  );
}
