"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, PlusCircle, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function BuyerDashboard() {
    const { user } = useAuth();
    const [warranties, setWarranties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarranties = async () => {
            if (!user) return;
            try {
                const q = query(collection(db, "warranties"), where("buyerId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWarranties(data);
            } catch (error) {
                console.error("Error fetching warranties", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWarranties();
    }, [user]);

    const activeCount = warranties.filter(w => w.status === 'active').length; // Logic can be improved with date check
    const expiringCount = 0; // Placeholder logic until we do real date diffs

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[125px] rounded-xl" />
                    <Skeleton className="h-[125px] rounded-xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-[150px]" />
                    <div className="grid gap-4">
                        <Skeleton className="h-[80px] rounded-xl" />
                        <Skeleton className="h-[80px] rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                        Track and manage your product warranties.
                    </p>
                </div>
                <Button asChild size="sm" className="gap-2">
                    <Link href="/dashboard/buyer/claim">
                        <PlusCircle className="h-4 w-4" />
                        Claim New
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Active Warranties</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-400">{activeCount}</div>
                        <p className="text-xs text-green-600 dark:text-green-500">Products currently protected</p>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">Expiring Soon</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">{expiringCount}</div>
                        <p className="text-xs text-orange-600 dark:text-orange-500">Action needed within 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Protected Products</h2>

                <div className="grid gap-4">
                    {warranties.length === 0 ? (
                        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-dashed">
                            <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                            <p className="text-neutral-500">No warranties claimed yet.</p>
                            <Button variant="link" asChild className="text-blue-600">
                                <Link href="/dashboard/buyer/claim">Claim your first warranty</Link>
                            </Button>
                        </div>
                    ) : (
                        warranties.map((w) => (
                            <div key={w.id} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                        <Package className="h-6 w-6 text-neutral-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{w.productModel}</h3>
                                        <p className="text-sm text-neutral-500 truncate">S/N: {w.serialNumber}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-none shadow-none">
                                        Active
                                    </Badge>
                                    <p className="text-xs text-neutral-400 mt-1">Exp: {w.expiryDate}</p>
                                    <div className="mt-2">
                                        <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700">
                                            <Link href={`/dashboard/buyer/transfer/${w.id}`}>Transfer</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
