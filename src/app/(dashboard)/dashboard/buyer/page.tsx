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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

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

    // Calculate statuses based on dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const activeCount = warranties.filter(w => {
        const expiry = new Date(w.expiryDate);
        return expiry >= today;
    }).length;

    const expiringCount = warranties.filter(w => {
        const expiry = new Date(w.expiryDate);
        return expiry >= today && expiry <= thirtyDaysFromNow;
    }).length;

    // Helper to determine status based on dates
    const getStatus = (expiryDateString: string) => {
        const expiry = new Date(expiryDateString);
        if (expiry < today) {
            return { label: 'Expired', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
        }
        if (expiry <= thirtyDaysFromNow) {
            return { label: 'Expiring Soon', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
        }
        return { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', border: 'border-transparent hover:border-blue-100 dark:hover:border-blue-900/30' };
    };

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

    // Helper for history status
    const getHistoryLabel = (action: string) => {
        switch (action) {
            case 'issued': return 'Warranty Issued';
            case 'claimed': return 'Claimed by Owner';
            case 'released': return 'Released / Transferred';
            default: return action;
        }
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

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Your Warranties</h2>
                        <p className="text-sm text-neutral-500">Manage and view details of your products.</p>
                    </div>
                    {/* Potential place for a filter or view toggle */}
                </div>

                {warranties.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">
                        <div className="bg-neutral-100 dark:bg-neutral-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No warranties yet</h3>
                        <p className="text-neutral-500 max-w-xs mx-auto mt-2">
                            When you purchase a product, the warranty will appear here.
                        </p>
                        <Button asChild className="mt-6" variant="outline">
                            <Link href="/dashboard/buyer/claim">Claim a Warranty</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {warranties.map((w) => {
                            const status = getStatus(w.expiryDate);
                            return (
                                <Sheet key={w.id}>
                                    <SheetTrigger asChild>
                                        <div className={`group relative bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border ${status.border}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                    <Package className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                                                </div>
                                                <Badge variant="secondary" className={`${status.color} shadow-none border-none`}>
                                                    {status.label}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 mb-4">
                                                <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50 truncate" title={w.productModel}>
                                                    {w.productModel}
                                                </h3>
                                                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                                                    S/N: {w.serialNumber}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-neutral-500 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                                                <span>Expires</span>
                                                <span className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
                                                    {w.expiryDate}
                                                </span>
                                            </div>
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent className="overflow-y-auto w-full sm:max-w-md p-0 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl">
                                        <div className="flex flex-col h-full">
                                            <div className="bg-neutral-50/50 dark:bg-neutral-900/50 p-6 border-b border-neutral-200 dark:border-neutral-800">
                                                <SheetHeader className="text-left space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                                                            <Package className="h-8 w-8 text-blue-600" />
                                                        </div>
                                                        <Badge className={`${status.color} border-none shadow-none text-sm px-3 py-1`}>
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <SheetTitle className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">{w.productModel}</SheetTitle>
                                                        <SheetDescription className="flex items-center gap-2 text-neutral-500">
                                                            <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs tracking-wider">S/N: {w.serialNumber}</span>
                                                        </SheetDescription>
                                                    </div>
                                                </SheetHeader>
                                            </div>

                                            <div className="flex-1 overflow-y-auto">
                                                <div className="p-6 space-y-8">
                                                    {/* Status Section */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Warranty Details</h3>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                                                <p className="text-xs text-neutral-500 mb-1">Expiry Date</p>
                                                                <p className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono">{w.expiryDate}</p>
                                                            </div>
                                                            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                                                <p className="text-xs text-neutral-500 mb-1">Issued By</p>
                                                                {w.sellerId ? (
                                                                    <Link href={`/dashboard/buyer/seller/${w.sellerId}`} className="font-semibold text-blue-600 truncate hover:underline flex items-center gap-1">
                                                                        {w.sellerName || "Official Store"}
                                                                    </Link>
                                                                ) : (
                                                                    <p className="font-semibold text-blue-600 truncate">{w.sellerName || "Official Store"}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <hr className="my-6 border-neutral-100 dark:border-neutral-800" />

                                                    {/* History Timeline */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="h-4 w-4 rounded-full border-2 border-neutral-300 dark:border-neutral-700 grid place-items-center">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                                                            </div>
                                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Journey History</h3>
                                                        </div>

                                                        <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-2 space-y-8 py-2">
                                                            {w.history?.map((event: any, i: number) => (
                                                                <div key={i} className="pl-6 relative group">
                                                                    <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-blue-500 group-hover:bg-blue-500 group-hover:scale-125 transition-all" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                                            {getHistoryLabel(event.action)}
                                                                        </span>
                                                                        <span className="text-xs text-neutral-500 mt-1 font-mono">
                                                                            {new Date(event.date?.toDate ? event.date.toDate() : event.date).toLocaleDateString(undefined, {
                                                                                year: 'numeric', month: 'short', day: 'numeric'
                                                                            })}
                                                                        </span>
                                                                        {event.user && (
                                                                            <div className="mt-2 text-xs bg-neutral-50 dark:bg-neutral-900 inline-block px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800 text-neutral-500 truncate max-w-[220px]">
                                                                                {event.user}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {(!w.history || w.history.length === 0) && (
                                                                <div className="pl-6 text-sm text-neutral-500 italic">No history available</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30">
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-lg hover:shadow-xl transition-all" asChild>
                                                    <Link href={`/dashboard/buyer/transfer/${w.id}`}>
                                                        Transfer Ownership
                                                    </Link>
                                                </Button>
                                                <p className="text-[10px] text-center text-neutral-400 mt-3">
                                                    Transferring will generate a unique code for the new owner.
                                                </p>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
