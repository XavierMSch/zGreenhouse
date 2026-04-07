import Scene from "./components/Scene";
import { HUDLayout } from './components/ui/HUDLayout';

export default function App() {
  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0">
        <Scene />
      </div>

      <HUDLayout />
    </div>
  );
}
