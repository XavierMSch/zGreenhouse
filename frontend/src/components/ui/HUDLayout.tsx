import PlantPanel from './panels/PlantPanel';
import SensorPanel from './panels/SensorPanel';

export function HUDLayout() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="select-none h-full flex flex-col justify-between items-left p-8">
        <SensorPanel />
        <PlantPanel />
      </div>
    </div>
  )
}