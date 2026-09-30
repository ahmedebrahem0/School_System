import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function AdminPage() {
  redirect(ROUTES.ADMIN.USERS);
}
