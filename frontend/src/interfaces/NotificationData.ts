type Severity = "fatal" | "warning" | "great";

export interface NotificationData {
  id: number;
  plantName?: string;
  message: string;
  severity: Severity;
}
