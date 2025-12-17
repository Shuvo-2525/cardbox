"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        expiring: 0,
        growth: 0
    });
    const [recentParams, setRecentParams] = useState<any[]>([]);
    const [companyProfile, setCompanyProfile] = useState<{ name: string; logo: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch Profile
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const d = userDoc.data();
                    setCompanyProfile({
                        name: d.businessName || d.displayName || "Seller Account",
                        logo: d.logoUrl || ""
                    });
                }

                // Fetch Warranties
                const q = query(
                    collection(db, "warranties"),
                    where("sellerId", "==", user.uid)
                );
                const snapshot = await getDocs(q);
                const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                const total = docs.length;
                const active = docs.filter((d: any) => d.status === 'active').length;
                const expiring = docs.filter((d: any) => {
                    if (!d.expiryDate) return false;
                    const today = new Date();
                    const expiry = new Date(d.expiryDate);
                    const diffTime = expiry.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 30;
                }).length;

                setStats({
                    total,
                    active,
                    expiring,
                    growth: 0
                });

                // Get recent 5
                const recent = docs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 5);
                setRecentParams(recent);

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-[120px] rounded-xl" />
                    <Skeleton className="h-[120px] rounded-xl" />
                    <Skeleton className="h-[120px] rounded-xl" />
                    <Skeleton className="h-[120px] rounded-xl" />
                </div>
                <div className="grid gap-4 md:grid-cols-1">
                    <Skeleton className="h-[300px] rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    {companyProfile ? (
                        <div className="flex items-center gap-3 mb-2">
                            {companyProfile.logo && (
                                <div className="h-12 w-12 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex items-center justify-center p-1 shadow-sm">
                                    <img src={companyProfile.logo} alt="Logo" className="h-full w-full object-contain" />
                                </div>
                            )}
                            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{companyProfile.name}</h1>
                        </div>
                    ) : (
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    )}
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Overview of your warranty issuances and performance.
                    </p>
                </div>
                {/* 
                <Button>
                    <Download className="mr-2 h-4 w-4" /> Download Report
                </Button> 
                */}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-32 w-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-indigo-100">Total Warranties</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <Package className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold">{stats.total}</div>
                        <p className="text-xs text-indigo-100/80 mt-1">Lifetime issuances</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-white dark:bg-neutral-900 border-l-4 border-l-green-500 group hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Active Now</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.active}</div>
                        <p className="text-xs text-neutral-500 mt-1">Valid products</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-white dark:bg-neutral-900 border-l-4 border-l-orange-500 group hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Expiring Soon</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stats.expiring}</div>
                        <p className="text-xs text-neutral-500 mt-1">Within next 30 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-1">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Recent Activity</h2>
                        <Link href="/dashboard/seller/inventory" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                            View All
                        </Link>
                    </div>

                    <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 overflow-hidden">
                        <CardContent className="p-0">
                            {!recentParams.length ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="h-16 w-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                                        <Package className="h-6 w-6 text-neutral-400" />
                                    </div>
                                    <p className="text-neutral-900 dark:text-neutral-100 font-medium">No recent activity</p>
                                    <p className="text-neutral-500 text-sm mt-1">Your issued warranties will appear here</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {recentParams.map((item: any) => (
                                        <div className="flex flex-col sm:flex-row sm:items-center p-6 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors gap-4" key={item.id}>
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                                                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{item.productModel}</p>
                                                    <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                                                        <span>Issued to {item.customerName}</span>
                                                        <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                                        <span className="font-mono">{item.serialNumber}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto w-full">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.status === 'active'
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                                    : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                                                    }`}>
                                                    {item.status?.toUpperCase() || "ACTIVE"}
                                                </span>
                                                <div className="text-right">
                                                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                                                        {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Date Issued</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
