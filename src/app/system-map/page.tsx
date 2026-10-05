import type { Metadata } from "next";
import { SystemMap } from "@/features/system-map/SystemMap";

export const metadata: Metadata = {
  title: "The living school map",
  description:
    "Explore how admins, teachers and students connect. An interactive journey through the six stages of EduSystem.",
};

export default function SystemMapPage() {
  return <SystemMap />;
}
