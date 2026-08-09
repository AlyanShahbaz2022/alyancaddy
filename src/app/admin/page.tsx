import { redirect } from "next/navigation";

import AdminEditor from "@/components/admin/AdminEditor";
import { getContent } from "@/lib/getContent";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  const content = await getContent();
  return <AdminEditor initialContent={content} />;
}