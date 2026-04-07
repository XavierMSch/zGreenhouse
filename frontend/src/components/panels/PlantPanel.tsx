import { useStore } from "../../hooks/useStore";

interface Plant {
  id: string;
  label: string;
  emoji: string;
}

const PLANTS: Plant[] = [
  { id: "thyme", label: "Thyme", emoji: "🌿" },
  { id: "basil", label: "Basil", emoji: "emoji" },
  { id: "mint", label: "Mint", emoji: "🍃" },
];

export default function PlantPanel() {
  const selectedPlant = useStore((s) => s.selectedPlant);
  const setSelectedPlant = useStore((s) => s.setSelectedPlant);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl w-80">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-white font-bold text-lg">Plant Selection</h2>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-bold">
          3 ACTIVE
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {PLANTS.map(({ id, label, emoji }) => {
          const active = selectedPlant === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedPlant(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                ${
                  active
                    ? "bg-emerald-500/20 border-emerald-400/50"
                    : "bg-white/5 border-transparent hover:border-emerald-400/30"
                }`}
            >
              <span className="text-3xl">{emoji}</span>
              <span
                className={`text-[10px] font-bold ${active ? "text-emerald-400" : "text-slate-400"}`}
              >
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => console.log("Starting prototype with:", selectedPlant)}
        className="w-full py-3 rounded-full bg-emerald-400 text-slate-900 font-extrabold text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all active:scale-95"
      >
        Start Prototype
      </button>
    </div>
  );
}
