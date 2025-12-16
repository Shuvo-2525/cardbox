"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Package } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";


// Simplified format function purely JS to avoid dependency if date-fns not installed, 
// though standard nextjs projects might not have it by default.
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};

export default function InventoryPage() {
    const { user } = useAuth();
    const [warranties, setWarranties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarranties = async () => {
            if (!user) return;
            try {
                // Note: Index might be required for compound queries. simple query for now.
                // Assuming 'createdAt' index exists or will warn.
                const q = query(
                    collection(db, "warranties"),
                    where("sellerId", "==", user.uid)
                    // orderBy("createdAt", "desc") // May require index
                );

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Manual sort to avoid index issues in rapid dev
                data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

                setWarranties(data);
            } catch (error) {
                console.error("Error fetching inventory", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWarranties();
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
                <div className="bg-white dark:bg-neutral-950 rounded-xl border shadow-sm overflow-hidden p-4 space-y-4">
                    <div className="flex gap-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Product Inventory</h1>
                <p className="text-neutral-500 mt-2">Manage all warranties issued by your store.</p>
            </div>

            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border-none overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                        <TableRow className="hover:bg-transparent border-b border-neutral-100 dark:border-neutral-800">
                            <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">Code</TableHead>
                            <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">Product</TableHead>
                            <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">Customer</TableHead>
                            <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">Sales Date</TableHead>
                            <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">Expiry</TableHead>
                            <TableHead className="font-semibold text-neutral-900 dark:text-neutral-100">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {warranties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16 text-neutral-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Package className="h-8 w-8 text-neutral-300" />
                                        <p>No warranties issued yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            warranties.map((w) => (
                                <TableRow key={w.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 border-b border-neutral-50 dark:border-neutral-900">
                                    <TableCell className="font-mono font-medium text-blue-600">{w.code}</TableCell>
                                    <TableCell>
                                        <div className="font-medium text-neutral-900 dark:text-neutral-100">{w.productModel}</div>
                                        <div className="text-xs text-neutral-500">{w.serialNumber}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-neutral-900 dark:text-neutral-100">{w.customerName}</div>
                                        <div className="text-xs text-neutral-500">{w.customerPhone}</div>
                                    </TableCell>
                                    <TableCell className="text-neutral-500">{formatDate(w.purchaseDate)}</TableCell>
                                    <TableCell className="text-neutral-500">{formatDate(w.expiryDate)}</TableCell>
                                    <TableCell>
                                        <Badge variant={w.status === 'active' ? 'default' : 'destructive'}
                                            className={w.status === 'active' ? "bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none" : "shadow-none"}>
                                            {w.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
