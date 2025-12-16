"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Wand2, Shield, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateWarrantyCode } from "@/lib/utils/code-generator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

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

    // Fetch Business Name
    const [businessName, setBusinessName] = useState("");

    useState(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                const docRef = doc(db, "users", user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setBusinessName(snap.data().businessName || user.displayName || "Official Store");
                }
            }
        };
        fetchProfile();
    });

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
                sellerName: businessName || user?.displayName || "Official Store",
                customerName,
                customerPhone,
                productModel,
                serialNumber,
                purchaseDate,
                expiryDate: expiry.toISOString().split("T")[0],
                durationMonths: parseInt(durationMonths),
                status: "active",
                createdAt: serverTimestamp(),
                locked: false // Initially unlocked for grace period
            });

            setCode(newCode);
            setSuccess(true);

            // Limited Reset
            setCustomerName("");
            setCustomerPhone("");
            setSerialNumber("");

        } catch (error) {
            console.error("Error issuing warranty", error);
            alert("Failed to issue warranty. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Issue New Warranty</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                        Create a tamper-proof digital record for a new sale.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    <Shield className="h-3 w-3" />
                    <span>Secure Blockchain-ready</span>
                </div>
            </motion.div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div className="ml-2">
                            <AlertTitle className="text-green-800 dark:text-green-400 font-bold">Warranty Activated Successfully!</AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-300 mt-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                                    <span>Generated Code:</span>
                                    <code className="bg-white dark:bg-neutral-950 px-3 py-1 rounded-lg border border-green-200 dark:border-green-800 font-mono text-lg font-bold tracking-wider select-all">
                                        {code}
                                    </code>
                                </div>
                                <p className="text-xs mt-3 opacity-90">
                                    <Lock className="h-3 w-3 inline mr-1" />
                                    Details will be locked for editing in 24 hours.
                                </p>
                            </AlertDescription>
                        </div>
                    </Alert>
                </motion.div>
            )}

            <Card className="border-none shadow-xl bg-white dark:bg-neutral-900">
                <CardHeader>
                    <CardTitle>Warranty Details</CardTitle>
                    <CardDescription>Enter product and customer information accurately.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Customer Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                Customer Info
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Customer Name</Label>
                                    <Input
                                        className="h-11"
                                        required
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        placeholder="e.g. Rahim Ahmed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        className="h-11"
                                        required
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        placeholder="e.g. 017..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Product Info
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Product Model</Label>
                                    <Input
                                        className="h-11"
                                        required
                                        value={productModel}
                                        onChange={e => setProductModel(e.target.value)}
                                        placeholder="e.g. Samsung Inverter AC 1.5T"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Serial Number / IMEI</Label>
                                    <Input
                                        className="h-11 font-mono text-sm"
                                        required
                                        value={serialNumber}
                                        onChange={e => setSerialNumber(e.target.value)}
                                        placeholder="Unique ID on device body/box"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Terms
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Purchase Date</Label>
                                    <Input
                                        className="h-11"
                                        type="date"
                                        required
                                        value={purchaseDate}
                                        onChange={e => setPurchaseDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Warranty Duration</Label>
                                    <Select value={durationMonths} onValueChange={setDurationMonths}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="6">6 Months</SelectItem>
                                            <SelectItem value="12">1 Year</SelectItem>
                                            <SelectItem value="18">1.5 Years</SelectItem>
                                            <SelectItem value="24">2 Years</SelectItem>
                                            <SelectItem value="36">3 Years</SelectItem>
                                            <SelectItem value="60">5 Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
                                disabled={loading}
                            >
                                {loading && <Wand2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Generating Secure Record..." : "Issue Warranty Card"}
                            </Button>
                            <p className="text-center text-xs text-neutral-400 mt-4">
                                By issuing this warranty, you certify the product details are correct.
                                <br className="hidden sm:block" />
                                Record will be permanently locked after 24 hours.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
