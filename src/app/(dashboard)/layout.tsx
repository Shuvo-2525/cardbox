"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // Simple client-side protection. Middleware is better for robust apps but this works for phase 4.
            // We'll let the user persist on the page for a split second or show a loading spinner if needed.
            router.push("/login/seller");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <AppSidebar />

            {/* Mobile Trigger */}
            <div className="md:hidden p-4 border-b bg-white dark:bg-neutral-950 flex items-center justify-between sticky top-0 z-20">
                <div className="font-bold">Card Box</div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <div className="h-full relative">
                            <AppSidebar /> {/* Reuse standard sidebar inside sheet, might need styling tweaks but works generally */}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <main className="md:ml-64 p-4 md:p-8 min-h-screen transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}
