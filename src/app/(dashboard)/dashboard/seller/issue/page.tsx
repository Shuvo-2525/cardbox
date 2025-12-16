"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Note: In a real app we'd need a proper date picker, using simple input type="date" for Phase 4 speed
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function generateWarrantyCode() {
    // Generate format: CB-XXX-XXX
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking chars
    const segment = () => Array(3).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    return `CB-${segment()}-${segment()}`;
}

export default function IssueWarrantyPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState("");

    // Form State
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [productModel, setProductModel] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
    const [durationMonths, setDurationMonths] = useState("12");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setCode("");

        try {
            const newCode = generateWarrantyCode();

            // Calculate expiry
            const start = new Date(purchaseDate);
            const expiry = new Date(start);
            expiry.setMonth(expiry.getMonth() + parseInt(durationMonths));

            await addDoc(collection(db, "warranties"), {
                code: newCode,
                sellerId: user?.uid,
                sellerEmail: user?.email,
                sellerName: user?.displayName || "Official Store",
                customerName,
                customerPhone,
                productModel,
                serialNumber,
                purchaseDate,
                expiryDate: expiry.toISOString().split("T")[0],
                durationMonths: parseInt(durationMonths),
                status: "active",
                createdAt: serverTimestamp()
            });

            setCode(newCode);
            setSuccess(true);

            // Reset form partly
            setCustomerName("");
            setCustomerPhone("");
            setSerialNumber("");
            // Keep product model as sellers often sell same item repeatedly

        } catch (error) {
            console.error("Error issuing warranty", error);
            alert("Failed to issue warranty. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Issue New Warranty</h1>
                <p className="text-neutral-500 mt-2">Create a tamper-proof digital record for a new sale.</p>
            </div>

            {success && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-400">Success!</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        Warranty activated. Code: <span className="font-bold text-lg select-all">{code}</span>
                    </AlertDescription>
                </Alert>
            )}

            <div className="bg-white dark:bg-neutral-950 p-8 rounded-2xl shadow-xl border-none">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-neutral-500">Customer Name</Label>
                            <Input className="h-11 bg-neutral-50 dark:bg-neutral-900 border-transparent focus:bg-white dark:focus:bg-neutral-950 focus:border-blue-500/50 transition-all" required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Rahim Ahmed" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-500">Phone Number</Label>
                            <Input className="h-11 bg-neutral-50 dark:bg-neutral-900 border-transparent focus:bg-white dark:focus:bg-neutral-950 focus:border-blue-500/50 transition-all" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="e.g. 017..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-neutral-500">Product Model</Label>
                        <Input className="h-11 bg-neutral-50 dark:bg-neutral-900 border-transparent focus:bg-white dark:focus:bg-neutral-950 focus:border-blue-500/50 transition-all" required value={productModel} onChange={e => setProductModel(e.target.value)} placeholder="e.g. Samsung Inverter AC 1.5T" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-neutral-500">Serial Number / IMEI</Label>
                        <Input className="h-11 bg-neutral-50 dark:bg-neutral-900 border-transparent focus:bg-white dark:focus:bg-neutral-950 focus:border-blue-500/50 transition-all" required value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="Unique ID on device" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-neutral-500">Purchase Date</Label>
                            <Input className="h-11 bg-neutral-50 dark:bg-neutral-900 border-transparent focus:bg-white dark:focus:bg-neutral-950 focus:border-blue-500/50 transition-all" type="date" required value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-500">Warranty Duration</Label>
                            <Select value={durationMonths} onValueChange={setDurationMonths}>
                                <SelectTrigger className="h-11 bg-neutral-50 dark:bg-neutral-900 border-transparent focus:border-blue-500/50">
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6">6 Months</SelectItem>
                                    <SelectItem value="12">1 Year</SelectItem>
                                    <SelectItem value="24">2 Years</SelectItem>
                                    <SelectItem value="36">3 Years</SelectItem>
                                    <SelectItem value="60">5 Years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base shadow-lg hover:shadow-blue-500/25 transition-all" disabled={loading}>
                        {loading ? "Issuing..." : "Activate Warranty"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
