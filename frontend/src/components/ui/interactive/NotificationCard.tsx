import { SEVERITY_COLORS } from "../../../configs/NotificationsConfig";
import type { NotificationData } from "../../../interfaces/NotificationData";

interface NotificationCardProps {
  data: NotificationData;
}

export default function NotificationCard(props: NotificationCardProps) {
  const notification = props.data;
  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col items-center">
      <div
        className={`w-full h-2 ${SEVERITY_COLORS[notification.severity]} flex-none`}
      />
      <div className="p-5 flex flex-col items-center gap-2">
        {notification.plantName && (
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Planta: {notification.plantName}
          </p>
        )}
        <p className="text-white text-sm leading-relaxed opacity-90 text-center">
          {notification.message}
        </p>
      </div>
    </div>
  );
}
