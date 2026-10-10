import { redirect } from "next/navigation";

import AdminEditor from "@/components/admin/AdminEditor";
import { getContent } from "@/lib/getContent";
import { isAdmin } from "@/lib/adminAuth";
import { getContentVersion } from "@/lib/saveContent";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  const [content, version] = await Promise.all([getContent(), getContentVersion()]);
  return <AdminEditor initialContent={content} initialVersion={version} />;
}