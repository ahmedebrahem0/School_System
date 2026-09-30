export const NOTIFICATION_TYPES = [
  "Announcement",
  "GradeAdded",
  "GradeUpdated",
  "AttendanceRecorded",
  "AbsenceWarning",
  "ScheduleChanged",
  "ClassAssigned",
  "SubjectAssigned",
  "LessonReminder",
  "RoleChanged",
  "UserPendingRole",
  "System",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAtUtc: string | null;
  expiresAtUtc: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  isRead: boolean;
  readAtUtc: string | null;
}

export interface NotificationPage {
  items: NotificationItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface NotificationFilters {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
}

export interface UnreadCountResponse {
  count: number;
}

export const NOTIFICATION_TARGET_TYPES = [
  "User",
  "Role",
  "Class",
  "SchoolGrade",
  "Subject",
  "All",
] as const;

export type NotificationTargetType =
  (typeof NOTIFICATION_TARGET_TYPES)[number];

export interface SendNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  targetType: NotificationTargetType;
  targetId?: string;
  expiresAtUtc?: string;
  scheduledAtUtc?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface SendNotificationResponse {
  notificationId: string;
  recipientCount: number;
  wasDuplicate: boolean;
  status?: "Published" | "Scheduled";
  scheduledAtUtc?: string | null;
}
