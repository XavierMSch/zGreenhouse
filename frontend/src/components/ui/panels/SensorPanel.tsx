import { SENSORS } from '../../../configs/SensorsConfig';
import SensorSlider from '../interactive/SensorSlider';

export default function SensorPanel() {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl w-80">
      <h2 className="text-white font-bold text-lg mb-6">Sensor Controls</h2>
      <div className="space-y-6">
        {SENSORS.map((data) => (
          <SensorSlider key={data.key} data={data}/>
        ))}
      </div>
    </div>
  );
}
