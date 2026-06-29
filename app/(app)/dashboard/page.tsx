import AppCard from "@/components/common/AppCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <AppCard title="Ventas Hoy">
          $0
        </AppCard>

        <AppCard title="Productos">
          0
        </AppCard>

        <AppCard title="Ventas Pendientes">
          0
        </AppCard>

        <AppCard title="Sincronización">
          OK
        </AppCard>

      </div>

    </div>
  );
}