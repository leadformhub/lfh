import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import { prisma } from "@/lib/db";
import { SuperAdminShell } from "./SuperAdminShell";

export const metadata: Metadata = {
  title: "Super Admin Panel | LeadFormHub",
  description: "Blank super admin panel scaffold.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SuperAdminPage() {
  const session = await getSuperAdminSession();
  if (!session) redirect("/super-admin/login");
  const usersCount = await prisma.user.count();

  return <SuperAdminShell usersCount={usersCount} />;
}
