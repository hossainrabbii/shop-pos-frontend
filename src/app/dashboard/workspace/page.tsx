import WorkspaceClient from "@/features/wordspace/components/WorkspaceClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace & Store Profile",
  description: "Manage your store configuration and receipt details",
};

export default function WorkspacePage() {
  return <WorkspaceClient />;
}
