"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login/seller");
            } else if (userRole && userRole !== "seller") {
                // If logged in as Buyer but trying to access Seller, boot them out
                router.push("/dashboard/buyer");
            }
        }
    }, [user, userRole, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
