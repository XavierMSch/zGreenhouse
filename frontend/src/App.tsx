import Scene from "./components/Scene";
import SensorPanel from "./components/ui/panels/SensorPanel";
import PlantPanel from "./components/ui/panels/PlantPanel";

export default function App() {
  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden relative">
      {/* Canvas 3D */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* HUD overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex flex-col justify-between items-left p-8">
          <div className="pointer-events-auto">
            <SensorPanel />
          </div>
          <div className="pointer-events-auto">
            <PlantPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
