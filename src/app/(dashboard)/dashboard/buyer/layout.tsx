"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BuyerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login/buyer");
            } else if (userRole && userRole !== "buyer") {
                // If logged in as Seller but trying to access Buyer, boot them out
                router.push("/dashboard/seller");
            }
        }
    }, [user, userRole, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-full">
            {children}
        </div>
    );
}
