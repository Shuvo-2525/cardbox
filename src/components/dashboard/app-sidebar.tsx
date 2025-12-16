"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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

export function AppSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Determine if user is seller or buyer based on URL or Context (Simplified for now)
    // In a real app we'd likely use the role from context, but URL check works for route highlighting.
    const isSeller = user?.email && pathname.includes("/seller");

    const sellerLinks = [
        { href: "/dashboard/seller", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/seller/issue", label: "Issue Warranty", icon: PlusCircle },
        { href: "/dashboard/seller/inventory", label: "Inventory", icon: Package },
        // { href: "/dashboard/seller/settings", label: "Settings", icon: Settings },
    ];

    const buyerLinks = [
        { href: "/dashboard/buyer", label: "My Warranties", icon: ShieldCheck },
        { href: "/dashboard/buyer/add", label: "Add Warranty", icon: FileText },
        { href: "/dashboard/buyer/claim", label: "Claim Warranty", icon: PlusCircle },
        // { href: "/dashboard/buyer/profile", label: "Profile", icon: Settings },
    ];

    const links = isSeller ? sellerLinks : buyerLinks;

    return (
        <div className="pb-12 min-h-screen border-r bg-white dark:bg-neutral-950 w-64 hidden md:block fixed left-0 top-0 h-full z-10">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center px-4 mb-6">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Card Box
                        </div>
                    </div>

                    <div className="space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Button
                                    key={link.href}
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start", isActive && "bg-neutral-100 dark:bg-neutral-800")}
                                    asChild
                                >
                                    <Link href={link.href}>
                                        <Icon className="mr-2 h-4 w-4" />
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
                    <Avatar className="h-8 w-8">
                        {user?.photoURL && <AvatarImage src={user.photoURL} />}
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.email}</p>
                        <p className="text-xs text-neutral-500 truncate capitalize">{isSeller ? "Seller" : "Buyer"}</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
