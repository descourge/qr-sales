import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

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

        <main className="flex-1 p-8">

          {children}

        </main>

      </div>

    </div>
  );
}