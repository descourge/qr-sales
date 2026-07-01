import AppLayout from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppLayout>
            {children}
            <Toaster richColors />
        </AppLayout>
    );
}