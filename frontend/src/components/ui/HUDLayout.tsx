import NotificationPanel from './panels/NotificationPanel';
import PlantPanel from './panels/PlantPanel';
import SensorPanel from './panels/SensorPanel';
import WindowPanel from './panels/WindowPanel';

export function HUDLayout() {
  return (
    <div className="absolute inset-0 pointer-events-none p-8 flex justify-between">
      <div className="select-none h-full flex flex-col justify-between items-left">
        <SensorPanel />
        <PlantPanel />
      </div>
      <div className="h-full right-8 top-8">
        <NotificationPanel />
      </div>
      <WindowPanel />
    </div>
  )
}