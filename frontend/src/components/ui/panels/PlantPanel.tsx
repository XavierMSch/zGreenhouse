import { PLANTS } from "../../../configs/PlantsConfig";
import PlantButton from "../interactive/PlantButton";

export default function PlantPanel() {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl w-80 pointer-events-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white font-bold text-lg">Plant Selection</h2>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-bold">
          {PLANTS.length} ACTIVE
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {PLANTS.map((data) => (
          <PlantButton key={data.name} data={data} />
        ))}
      </div>
    </div>
  );
}
