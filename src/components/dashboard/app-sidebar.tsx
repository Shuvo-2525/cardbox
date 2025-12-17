"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    PlusCircle,
    Package,
    Settings,
    LogOut,
    ShieldCheck,
    FileText
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [companyProfile, setCompanyProfile] = useState<{ name: string; logo: string } | null>(null);

    // Determine if user is seller or buyer based on URL or Context (Simplified for now)
    const isSeller = user?.email && pathname.includes("/seller");

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid && isSeller) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        setCompanyProfile({
                            name: data.businessName || data.displayName || "Seller Account",
                            logo: data.logoUrl || ""
                        });
                    }
                } catch (e) {
                    console.error("Error fetching branding", e);
                }
            }
        };
        fetchProfile();
    }, [user, isSeller]);

    const sellerLinks = [
        { href: "/dashboard/seller", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/seller/issue", label: "Issue Warranty", icon: PlusCircle },
        { href: "/dashboard/seller/warranties", label: "All Warranties", icon: Package },
        { href: "/dashboard/seller/settings", label: "Settings", icon: Settings },
    ];

    const buyerLinks = [
        { href: "/dashboard/buyer", label: "My Warranties", icon: ShieldCheck },
        { href: "/dashboard/buyer/add", label: "Add Warranty", icon: FileText },
        { href: "/dashboard/buyer/claim", label: "Claim Warranty", icon: PlusCircle },
        // { href: "/dashboard/buyer/profile", label: "Profile", icon: Settings },
    ];

    const links = isSeller ? sellerLinks : buyerLinks;

    return (
        <div className={cn("pb-12 min-h-screen bg-white dark:bg-neutral-950 w-64 hidden md:block fixed left-0 top-0 h-full z-10 shadow-xl shadow-neutral-200/40 dark:shadow-none border-r border-neutral-100 dark:border-neutral-800", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center px-4 mb-8">
                        {isSeller && companyProfile ? (
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center overflow-hidden">
                                    {companyProfile.logo ? (
                                        <img src={companyProfile.logo} alt="Logo" className="h-full w-full object-contain p-1" />
                                    ) : (
                                        <Package className="h-5 w-5 text-indigo-600" />
                                    )}
                                </div>
                                <div className="font-bold text-lg tracking-tight leading-tight truncate max-w-[140px]">
                                    {companyProfile.name}
                                </div>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Card Box
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Button
                                    key={link.href}
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start h-10 mb-1", isActive && "bg-neutral-100 dark:bg-neutral-800 font-semibold")}
                                    asChild
                                >
                                    <Link href={link.href}>
                                        <Icon className={cn("mr-2 h-4 w-4", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-500")} />
                                        {link.label}
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 w-full px-4">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <Avatar className="h-8 w-8 border border-neutral-200 dark:border-neutral-800">
                        {user?.photoURL && <AvatarImage src={user.photoURL} />}
                        <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-xs">{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-neutral-900 dark:text-neutral-100">{companyProfile?.name || user?.displayName || user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-neutral-500 truncate capitalize">{isSeller ? "Seller Account" : "Buyer Account"}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-100 dark:border-red-900/30" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
