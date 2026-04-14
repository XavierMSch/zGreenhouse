import { SEVERITY_COLORS } from '../../../configs/NotificationsConfig';
import type { NotificationData } from '../../../interfaces/NotificationData';

interface NotificationCardProps {
    data: NotificationData;
}

export default function NotificationCard(props: NotificationCardProps) {
  const notification = props.data;
  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col items-center">
      <div className={`w-full h-2 ${SEVERITY_COLORS[notification.severity]} flex-none`} />
      <div className="p-5 flex items-center justify-center">
        <p className="text-white text-sm leading-relaxed opacity-90">
          {notification.message}
        </p>
      </div>
    </div>
  );
}