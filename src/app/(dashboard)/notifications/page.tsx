import { Suspense } from "react";
import { NotificationsPage } from "@/features/notifications/components/NotificationsPage";

export default function NotificationsRoute() {
  return (
    <Suspense fallback={null}>
      <NotificationsPage />
    </Suspense>
  );
}
