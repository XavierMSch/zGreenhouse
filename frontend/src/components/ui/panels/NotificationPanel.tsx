import type { NotificationData } from '../../../interfaces/NotificationData';
import NotificationCard from '../interactive/NotificationCard';

const notifications: NotificationData[] = [
    // {
    //     id: 1,
    //     message: 'Bajar la temperatura inmediatamente, ya que 40°C es letal para la albahaca. Aumentar la ventilación para reducir la temperatura y aumentar la humedad si es necesario (idealmente entre 60-70%)',
    //     severity: 'fatal'
    // }
]

export default function NotificationPanel() {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl h-full rounded-2xl p-6 border border-white/5 shadow-2xl w-80 pointer-events-auto flex flex-col">
      <div>
        <h2 className="text-white font-bold text-lg">
            Recomendations
        </h2>
      </div>
      <div className='flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2'>
        {notifications.map((notification) => (
          <NotificationCard
            data={notification}
          />
        ))}
      </div>
      <div className='flex-none pt-4"'>
        <button className="w-full py-3 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl transition-all active:scale-95">
            ASK LLM
        </button>
      </div>
    </div>
  );
}