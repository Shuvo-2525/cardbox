"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Package, Search, SlidersHorizontal, ArrowUpDown, MoreHorizontal, User, Calendar, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

// Helper for date formatting
const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
};

export default function WarrantiesPage() {
    const { user } = useAuth();
    const [warranties, setWarranties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedWarranty, setSelectedWarranty] = useState<any | null>(null);

    useEffect(() => {
        const fetchWarranties = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "warranties"),
                    where("sellerId", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Manual sort desc
                data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

                setWarranties(data);
            } catch (error) {
                console.error("Error fetching warranties", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWarranties();
    }, [user]);

    // Filter Logic
    const filteredWarranties = warranties.filter(w => {
        const query = searchQuery.toLowerCase();
        return (
            w.productModel?.toLowerCase().includes(query) ||
            w.code?.toLowerCase().includes(query) ||
            w.customerName?.toLowerCase().includes(query) ||
            w.serialNumber?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">All Warranties</h1>
                <p className="text-neutral-500 mt-2">Manage and track all warranties issued by your store.</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    <Input
                        placeholder="Search by product, customer, or serial..."
                        className="pl-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </Button>
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                    </Button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-50/50 dark:bg-neutral-900/50">
                        <TableRow className="hover:bg-transparent border-b border-neutral-100 dark:border-neutral-800">
                            <TableHead className="w-[100px] font-semibold">Code</TableHead>
                            <TableHead className="font-semibold">Product Details</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Sales Date</TableHead>
                            <TableHead className="font-semibold">Expiry</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16 px-2 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredWarranties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-neutral-500">
                                        <div className="h-12 w-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-3">
                                            <Package className="h-6 w-6 text-neutral-400" />
                                        </div>
                                        <p className="text-lg font-medium">No warranties found</p>
                                        <p className="text-sm max-w-sm mt-1">
                                            {searchQuery ? "Try adjusting your search terms." : "Get started by issuing your first warranty."}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <AnimatePresence>
                                {filteredWarranties.map((w, i) => (
                                    <Sheet key={w.id}>
                                        <SheetTrigger asChild>
                                            <motion.tr
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="group cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 border-b border-neutral-50 dark:border-neutral-900 transition-colors"
                                                onClick={() => setSelectedWarranty(w)}
                                            >
                                                <TableCell className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                                                    {w.code}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{w.productModel}</div>
                                                    <div className="text-xs text-neutral-500 flex items-center gap-1">
                                                        <span className="uppercase tracking-wider">SN:</span> {w.serialNumber}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[10px] text-blue-600 font-bold">
                                                            {w.customerName?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{w.customerName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-neutral-500 text-sm">{formatDate(w.purchaseDate)}</TableCell>
                                                <TableCell className="text-neutral-500 text-sm">{formatDate(w.expiryDate)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={
                                                            w.status === 'active'
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                        }
                                                    >
                                                        {w.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4 text-neutral-400" />
                                                    </Button>
                                                </TableCell>
                                            </motion.tr>
                                        </SheetTrigger>
                                        <SheetContent className="overflow-hidden w-full sm:max-w-xl p-0 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl">
                                            {selectedWarranty && (
                                                <div className="flex flex-col h-full">
                                                    {/* Sheet Header */}
                                                    <div className="bg-neutral-50/50 dark:bg-neutral-900/50 p-6 border-b border-neutral-200 dark:border-neutral-800">
                                                        <SheetHeader className="text-left space-y-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="space-y-1">
                                                                    <Badge variant="outline" className="bg-white dark:bg-neutral-900 font-mono text-xs uppercase tracking-wider text-neutral-500">
                                                                        {selectedWarranty.code}
                                                                    </Badge>
                                                                    <SheetTitle className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                                                                        {selectedWarranty.productModel}
                                                                    </SheetTitle>
                                                                </div>
                                                                <Badge
                                                                    className={
                                                                        selectedWarranty.status === 'active'
                                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none px-3 py-1"
                                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none px-3 py-1"
                                                                    }
                                                                >
                                                                    {selectedWarranty.status}
                                                                </Badge>
                                                            </div>
                                                            <SheetDescription className="flex items-center gap-6 text-neutral-500">
                                                                <span className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4" />
                                                                    SN: {selectedWarranty.serialNumber}
                                                                </span>
                                                                <span className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4" />
                                                                    {formatDate(selectedWarranty.purchaseDate)}
                                                                </span>
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                    </div>

                                                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                                        {/* Customer Details */}
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                                <User className="h-4 w-4 text-indigo-600" />
                                                                Customer Details
                                                            </h3>
                                                            <div className="bg-neutral-50 dark:bg-neutral-900/30 rounded-xl p-4 border border-neutral-100 dark:border-neutral-800 space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                                                                            {selectedWarranty.customerName?.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-neutral-900 dark:text-neutral-100">{selectedWarranty.customerName}</p>
                                                                            <p className="text-xs text-neutral-500">Customer</p>
                                                                        </div>
                                                                    </div>
                                                                    <Button variant="outline" size="sm" className="h-8">View Profile</Button>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                                            <Mail className="h-3.5 w-3.5" /> Email
                                                                        </div>
                                                                        <p className="text-sm font-medium">{selectedWarranty.customerEmail}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                                            <Phone className="h-3.5 w-3.5" /> Phone
                                                                        </div>
                                                                        <p className="text-sm font-medium">{selectedWarranty.customerPhone}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Warranty Activity / History */}
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                                                                Warranty Activity
                                                            </h3>
                                                            <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-2 space-y-6 py-2">
                                                                {/* Created Event */}
                                                                <div className="pl-6 relative">
                                                                    <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-4 ring-white dark:ring-neutral-950" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Warranty Issued</span>
                                                                        <span className="text-xs text-neutral-500">Created by {user?.displayName || "You"}</span>
                                                                        <span className="text-xs text-neutral-400 mt-1 font-mono">{formatDate(selectedWarranty.createdAt?.toDate ? selectedWarranty.createdAt.toDate() : new Date())}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Expiry Event (Future) */}
                                                                <div className="pl-6 relative opacity-60">
                                                                    <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 ring-4 ring-white dark:ring-neutral-950" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Expiration Date</span>
                                                                        <span className="text-xs text-neutral-500">Expected end of coverage</span>
                                                                        <span className="text-xs text-neutral-400 mt-1 font-mono">{formatDate(selectedWarranty.expiryDate)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30 flex gap-3">
                                                        <Button variant="outline" className="flex-1">Edit Details</Button>
                                                        <Button variant="destructive" className="flex-1">Revoke Warranty</Button>
                                                    </div>
                                                </div>
                                            )}
                                        </SheetContent>
                                    </Sheet>
                                ))}
                            </AnimatePresence>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
