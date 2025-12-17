"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ShoppingBag, Calendar, Loader2 } from "lucide-react";

export default function AddManualWarrantyPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [productName, setProductName] = useState("");
    const [brand, setBrand] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
    const [sellerName, setSellerName] = useState("");
    const [notes, setNotes] = useState("");

    // Expiry Logic
    const [durationMonths, setDurationMonths] = useState("12");
    const [customExpiryDate, setCustomExpiryDate] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalExpiryDate = "";
            let finalDuration = 0;

            if (durationMonths !== "custom") {
                const start = new Date(purchaseDate);
                const expiry = new Date(start);
                finalDuration = parseInt(durationMonths);
                expiry.setMonth(expiry.getMonth() + finalDuration);
                finalExpiryDate = expiry.toISOString().split("T")[0];
            } else {
                if (!customExpiryDate) {
                    alert("Please select an expiration date");
                    setLoading(false);
                    return;
                }
                finalExpiryDate = customExpiryDate;
                // Calculate approximate duration for display
                const start = new Date(purchaseDate);
                const end = new Date(customExpiryDate);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                finalDuration = Math.round(diffDays / 30); // Approx months
            }

            await addDoc(collection(db, "warranties"), {
                buyerId: user?.uid, // FIXED: Changed from userId to buyerId for dashboard query compatibility
                customerEmail: user?.email,
                customerName: user?.displayName || "Me",

                productModel: productName,
                brand,
                serialNumber: serialNumber || "N/A",
                sellerName: sellerName || "Unknown Shop",

                purchaseDate,
                expiryDate: finalExpiryDate,
                durationMonths: finalDuration,
                notes,

                type: "manual",
                status: "self_declared",
                verificationStatus: "unverified",
                createdAt: serverTimestamp()
            });

            router.push("/dashboard/buyer");
        } catch (error) {
            console.error("Error adding warranty", error);
            alert("Failed to add warranty. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Warranty Manually</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                    Digitize your paper warranties to keep track of them in one place.
                </p>
            </div>

            <Card className="border-none shadow-xl bg-white dark:bg-neutral-900">
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Enter the details as they appear on your receipt or warranty card.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Product Name / Model</Label>
                                <div className="relative">
                                    <ShoppingBag className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                                    <Input
                                        className="pl-10"
                                        required
                                        placeholder="e.g. Sony Bravia 55' TV"
                                        value={productName}
                                        onChange={e => setProductName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Brand (Optional)</Label>
                                <Input
                                    placeholder="e.g. Sony"
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Serial Number (Optional)</Label>
                                <Input
                                    placeholder="Device Serial No."
                                    value={serialNumber}
                                    onChange={e => setSerialNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Shop / Seller Name</Label>
                            <Input
                                placeholder="Where did you buy it?"
                                value={sellerName}
                                onChange={e => setSellerName(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Purchase Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                                    <Input
                                        className="pl-10"
                                        type="date"
                                        required
                                        value={purchaseDate}
                                        onChange={e => setPurchaseDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Expiry Section */}
                            <div className="space-y-3">
                                <Label>Warranty Validity</Label>
                                <Select value={durationMonths} onValueChange={setDurationMonths}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="6">6 Months</SelectItem>
                                        <SelectItem value="12">1 Year</SelectItem>
                                        <SelectItem value="24">2 Years</SelectItem>
                                        <SelectItem value="36">3 Years</SelectItem>
                                        <SelectItem value="60">5 Years</SelectItem>
                                        <SelectItem value="custom">Custom Date Range</SelectItem>
                                    </SelectContent>
                                </Select>

                                {durationMonths === "custom" && (
                                    <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                                        <Label className="text-xs text-neutral-500 mb-1.5 block">Warranty Expiry Date</Label>
                                        <Input
                                            type="date"
                                            required={durationMonths === "custom"}
                                            value={customExpiryDate}
                                            onChange={e => setCustomExpiryDate(e.target.value)}
                                            min={purchaseDate}
                                            className="border-indigo-200 focus-visible:ring-indigo-500 bg-indigo-50/30"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <Input
                                placeholder="Any extra info..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Adding..." : "Add to My Warranties"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
