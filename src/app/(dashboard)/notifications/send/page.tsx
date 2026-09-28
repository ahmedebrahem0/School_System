"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { SendNotificationForm } from "@/features/notifications/components/SendNotificationForm";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export default function SendNotificationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const canSend = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;

  useEffect(() => {
    if (!isLoading && !canSend) router.replace(ROUTES.NOTIFICATIONS);
  }, [canSend, isLoading, router]);

  if (isLoading || !canSend) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Send notification"
        subtitle="Choose an audience and send a school update"
      />
      <SendNotificationForm />
    </div>
  );
}
