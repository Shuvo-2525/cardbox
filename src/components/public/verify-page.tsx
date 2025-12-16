"use client";

import { useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, CheckCircle, XCircle, ShieldCheck, HelpCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface VerifyPageProps {
    dict: any;
}

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

export function VerifyPage({ dict }: VerifyPageProps) {
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

    // Helper to mask name
    const maskName = (name: string) => {
        if (!name) return "Unknown";
        return name.split(" ").map(part => {
            if (part.length <= 2) return part;
            return part[0] + "*".repeat(part.length - 1);
        }).join(" ");
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col">
            <Navbar dict={dict} />

            <main className="flex-1 relative flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-3xl opacity-30 animate-pulse-slow" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="w-full max-w-2xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10 space-y-4"
                    >
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2 shadow-sm">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                            Verify Warranty
                        </h1>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto">
                            Enter your unique warranty code or product serial number to verify authenticity instantly.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-neutral-800/80 backdrop-blur-xl rounded-3xl p-2 shadow-2xl shadow-neutral-200/50 dark:shadow-none border border-neutral-200 dark:border-neutral-700"
                    >
                        <form onSubmit={handleSearch} className="relative flex items-center">
                            <Search className="absolute left-6 h-6 w-6 text-neutral-400" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter Code (CB-...) or Serial Number"
                                className="h-16 pl-16 pr-32 text-lg bg-transparent border-none focus-visible:ring-0 rounded-2xl placeholder:text-neutral-400 font-medium"
                            />
                            <Button
                                type="submit"
                                disabled={loading || !searchQuery.trim()}
                                className="absolute right-2 h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
                            </Button>
                        </form>
                    </motion.div>

                    <div className="min-h-[300px] mt-12 flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center text-neutral-400 space-y-4 pt-10"
                                >
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                    <p>Scanning blockchain records...</p>
                                </motion.div>
                            )}

                            {!loading && hasSearched && error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center p-8 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 max-w-md w-full"
                                >
                                    <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <XCircle className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-1">Not Found</h3>
                                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                </motion.div>
                            )}

                            {!loading && result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full"
                                >
                                    <Card className="border-none shadow-2xl bg-white dark:bg-neutral-800 overflow-hidden relative">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

                                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-neutral-50/50 dark:bg-neutral-900/20">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-xl">Result Found</CardTitle>
                                                {result.status === "active" && <CheckCircle className="h-5 w-5 text-green-500" />}
                                            </div>
                                            <Badge className={`px-3 py-1 text-sm font-semibold rounded-lg ${result.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hovering:bg-green-100" : "bg-red-100 text-red-700"}`}>
                                                {result.status === "active" ? "Active Warranty" : "Expired"}
                                            </Badge>
                                        </CardHeader>

                                        <CardContent className="pt-6">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div>
                                                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Product Details</h3>
                                                        <p className="text-xl font-bold mb-1">{result.productModel}</p>
                                                        <div className="flex items-center gap-2 text-sm text-neutral-500 font-mono bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded w-fit">
                                                            <span className="select-all">SN: {result.serialNumber}</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Duration</h3>
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center min-w-[80px]">
                                                                <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">{result.durationMonths}</span>
                                                                <span className="text-xs text-blue-600/60 dark:text-blue-400/60 font-semibold uppercase">Months</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-neutral-500">Expires on</p>
                                                                <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                                    {new Date(result.expiryDate).toLocaleDateString(undefined, {
                                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                                                    <div>
                                                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Issued By</h3>
                                                        <p className="font-semibold text-blue-600 dark:text-blue-400 text-lg">{result.sellerName || "Official Partner"}</p>
                                                        <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500 mt-1">
                                                            <CheckCircle className="h-3.5 w-3.5" />
                                                            <span>Verified Seller</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Owner</h3>
                                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{maskName(result.customerName)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="h-4 w-4" />
                                                    <span>Blockchain Verified Record</span>
                                                </div>
                                                <p>ID: {result.id.slice(0, 8)}...</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {!loading && !hasSearched && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-neutral-400 max-w-sm"
                                >
                                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Find your code on the warranty card or use the product serial number located on the device.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer dict={dict} />
        </div>
    );
}
