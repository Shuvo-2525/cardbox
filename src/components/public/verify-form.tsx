"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, CheckCircle, XCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WarrantyResult {
    id: string;
    status: string;
    productModel: string;
    serialNumber: string;
    sellerName?: string;
    customerName: string;
    durationMonths: number;
    expiryDate: string;
}

export function VerifyForm({ dict }: { dict: Record<string, string> }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<WarrantyResult | null>(null);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);
        setHasSearched(true);

        try {
            const warrantiesRef = collection(db, "warranties");

            // Try searching by Code first
            let q = query(warrantiesRef, where("code", "==", searchQuery.trim()));
            let snapshot = await getDocs(q);

            // If not found, try searching by Serial Number
            if (snapshot.empty) {
                q = query(warrantiesRef, where("serialNumber", "==", searchQuery.trim()));
                snapshot = await getDocs(q);
            }

            if (!snapshot.empty) {
                const docSnap = snapshot.docs[0];
                setResult({ id: docSnap.id, ...docSnap.data() } as WarrantyResult);
            } else {
                setError("Warranty not found. Please check the code or serial number.");
            }

        } catch (err) {
            console.error("Error verifying warranty:", err);
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to mask name (e.g. "John Doe" -> "J*** D**")
    const maskName = (name: string) => {
        if (!name) return "Unknown";
        return name.split(" ").map(part => {
            if (part.length <= 2) return part;
            return part[0] + "*".repeat(part.length - 1);
        }).join(" ");
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Serial No. or Warranty Code (e.g. CB-XXX...)"
                    className="pl-10 h-14 text-lg rounded-full shadow-sm"
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 rounded-full m-1 px-6 bg-blue-600 hover:bg-blue-700"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
            </form>

            <div className="min-h-[200px] flex items-center justify-center">
                {loading && (
                    <div className="text-neutral-500 animate-pulse">Checking records...</div>
                )}

                {!loading && hasSearched && error && (
                    <div className="text-center text-red-500">
                        <XCircle className="h-10 w-10 mx-auto mb-2 opacity-80" />
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !hasSearched && (
                    <p className="text-sm text-neutral-400 opacity-50">ফলাফল এখানে দেখানো হবে...</p>
                )}

                {!loading && result && (
                    <Card className="w-full text-left border-2 border-blue-100 dark:border-blue-900 shadow-lg animate-in fade-in zoom-in-95 bg-white dark:bg-neutral-800">
                        <CardHeader className="border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Warranty Details</CardTitle>
                                <Badge className={result.status === "active" ? "bg-green-100 text-green-700 pointer-events-none shadow-none border-none" : "bg-red-100 text-red-700"}>
                                    {result.status === "active" ? "Valid / Active" : "Expired / Inactive"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-1">Product</h3>
                                <p className="text-lg font-semibold">{result.productModel}</p>
                                <p className="text-sm text-neutral-400 font-mono mt-1">{result.serialNumber}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-1">Status</h3>
                                <p className="text-sm font-medium">Sold by: <span className="font-semibold text-blue-600 dark:text-blue-400">{result.sellerName || "Official Store"}</span></p>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Owned by: {maskName(result.customerName)}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-1">Duration</h3>
                                <p className="text-lg font-medium">{result.durationMonths} Months</p>
                                <p className="text-sm text-neutral-400 mt-1">
                                    Exp: {new Date(result.expiryDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="md:col-span-2 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700 flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">Verified Official Product</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
