type Severity = 'fatal' | 'warning' | 'great'

export interface NotificationData {
  id: number;
  message: string;
  severity: Severity;
}
