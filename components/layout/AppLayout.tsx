import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import AutoSync from "@/shared/components/AutoSync";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">

      <AppSidebar />

      <div className="flex flex-1 flex-col">

        <AppHeader />
        <AutoSync />

        <main className="flex-1 p-8">

          {children}

        </main>

      </div>

    </div>
  );
}