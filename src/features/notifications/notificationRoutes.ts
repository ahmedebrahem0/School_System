import { ROUTES } from "@/constants/routes";
import { ROLES, type Role } from "@/constants/roles";
import type { NotificationItem } from "./types";

function positiveId(value: string | null) {
  if (!value) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function getNotificationHref(
  notification: NotificationItem,
  role?: Role
): string | null {
  const entityId = positiveId(notification.relatedEntityId);

  if (notification.type === "UserPendingRole" && role === ROLES.ADMIN) {
    return ROUTES.ADMIN.USERS;
  }

  switch (notification.relatedEntityType) {
    case "StudentGrade":
      if (role === ROLES.STUDENT) return ROUTES.STUDENT.MY_GRADES;
      return entityId ? ROUTES.GRADES.DETAILS(entityId) : ROUTES.GRADES.LIST;
    case "Attendance":
      if (role === ROLES.STUDENT) return ROUTES.STUDENT.MY_ATTENDANCE;
      return entityId
        ? ROUTES.ATTENDANCES.DETAILS(entityId)
        : ROUTES.ATTENDANCES.LIST;
    case "Timetable":
      return ROUTES.TIMETABLES.LIST;
    case "Class":
      return entityId ? ROUTES.CLASSES.DETAILS(entityId) : ROUTES.CLASSES.LIST;
    default:
      return null;
  }
}
