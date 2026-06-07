import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Providers>
      <div className="flex h-screen bg-[#09090b] overflow-hidden text-white">
        {/* Client Sidebar */}
        <Sidebar user={{ name: session.user.name, email: session.user.email }} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="p-8 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </Providers>
  );
}
