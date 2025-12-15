"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function ClaimWarrantyPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [code, setCode] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            // 1. Find the warranty
            const q = query(collection(db, "warranties"), where("code", "==", code.trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("Warranty code not found. Please check and try again.");
                setLoading(false);
                return;
            }

            const warrantyDoc = querySnapshot.docs[0];
            const warrantyData = warrantyDoc.data();

            // 2. Validate
            if (warrantyData.buyerId) {
                setError("This warranty has already been claimed by another user.");
                setLoading(false);
                return;
            }

            // Optional: Validate purchase date matches record for extra security
            // if (warrantyData.purchaseDate !== purchaseDate) { ... }

            // 3. Update Document
            await updateDoc(doc(db, "warranties", warrantyDoc.id), {
                buyerId: user?.uid,
                buyerEmail: user?.email,
                claimedAt: serverTimestamp()
            });

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard/buyer");
            }, 2000);

        } catch (error) {
            console.error("Error claiming warranty", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-8 mt-10">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Claim Warranty</h1>
                <p className="text-neutral-500 mt-2">Add a new product to your digital wallet.</p>
            </div>

            {success && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-400">Success!</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        Warranty claimed successfully. Redirecting...
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border shadow-sm">
                <form onSubmit={handleClaim} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Warranty Code</Label>
                        <Input
                            required
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            placeholder="e.g. CB-K9L-M3P"
                            className="font-mono text-center text-lg tracking-widest uppercase"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Purchase Date (Verify)</Label>
                        <Input
                            type="date"
                            value={purchaseDate}
                            onChange={e => setPurchaseDate(e.target.value)}
                            className="text-center"
                        />
                        <p className="text-xs text-neutral-400 text-center">Optional: Matches invoice date</p>
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading || success}>
                        {loading ? "Verifying..." : "Claim Warranty"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
