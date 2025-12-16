"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        expiring: 0,
        growth: 0 // Placeholder logic for now
    });
    const [recentParams, setRecentParams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch all warranties for this seller
                // Optimization: In real app, use aggregation queries or counters
                const q = query(
                    collection(db, "warranties"),
                    where("sellerId", "==", user.uid)
                );
                const snapshot = await getDocs(q);
                const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                const total = docs.length;
                const active = docs.filter((d: any) => d.status === 'active').length; // Simple status check
                // Expiring logic would need date comparison. Placeholder:
                const expiring = 0;

                setStats({
                    total,
                    active,
                    expiring,
                    growth: 0
                });

                // Get recent 5
                // Docs are not guaranteed sorted unless ordered in query, but doing client side sort for MVP speed
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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                    Overview of your warranty issuances.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">Total Warranties</CardTitle>
                        <Package className="h-4 w-4 text-blue-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-blue-100/80 mt-1">Lifetime issuances</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-xl bg-white dark:bg-neutral-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Active Now</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{stats.active}</div>
                        <p className="text-xs text-neutral-500 mt-1">Valid products</p>
                    </CardContent>
                </Card>
                {/* 
                <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500">Expiring Soon</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.expiring}</div>
                        <p className="text-xs text-neutral-500">Within next 30 days</p>
                    </CardContent>
                </Card>
                 */}
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
                        <CardContent className="p-0">
                            {!recentParams.length ? (
                                <div className="text-center text-neutral-500 py-12">No recent activity</div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {recentParams.map((item: any) => (
                                        <div className="flex items-center p-6 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors" key={item.id}>
                                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-4">
                                                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none text-neutral-900 dark:text-neutral-100">Warranty Issued</p>
                                                <p className="text-sm text-neutral-500">{item.productModel} - {item.customerName}</p>
                                            </div>
                                            <div className="ml-auto font-medium text-sm text-neutral-500">
                                                {new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}
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
