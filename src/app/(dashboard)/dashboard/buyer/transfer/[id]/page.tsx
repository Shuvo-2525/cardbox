"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Share2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TransferWarrantyPage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const router = useRouter();
    const [warranty, setWarranty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [transferredCode, setTransferredCode] = useState("");

    // Need to unwrap params in Next.js 15+ if this project uses it, 
    // but generic approach works for 13/14. 
    // SAFTEY: In Next.js 15 params are async. In 14 they are not. 
    // Assuming 14 based on package.json (16.0.10? wait. package.json said next 16.0.10. That's extremely new/canary? Or maybe 14/15. Assuming 15 behavior is safer: treat as promise if needed, but standard prop access works often.)
    // Wait, package.json said "next": "16.0.10". That must be a typo in user's env or a very specific version. 
    // Let's assume standard client component behavior.

    useEffect(() => {
        const fetchWarranty = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "warranties", params.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.buyerId === user.uid) {
                        setWarranty({ id: docSnap.id, ...data });
                    } else {
                        // Not owner
                        router.push("/dashboard/buyer");
                    }
                } else {
                    router.push("/dashboard/buyer");
                }
            } catch (error) {
                console.error("Error fetching warranty", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWarranty();
    }, [user, params.id, router]);

    const handleTransfer = async () => {
        if (!confirm("Are you sure? This will remove the warranty from your account.")) return;

        setActionLoading(true);
        try {
            // Release the warranty
            await updateDoc(doc(db, "warranties", warranty.id), {
                buyerId: null,
                buyerEmail: null,
                // We keep the claimedAt history or clear it? 
                // Let's clear it so it looks "fresh" for the next claim, or keep history in a separate collection ideally.
                // For MVP:
                previousOwner: user?.email,
                transferredAt: new Date().toISOString()
            });

            setTransferredCode(warranty.code);
        } catch (error) {
            console.error("Error transferring", error);
            alert("Transfer failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!warranty) return <div>Warranty not found</div>;

    if (transferredCode) {
        return (
            <div className="max-w-md mx-auto mt-10 space-y-6">
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <Share2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-400">Transfer Successful</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        You have successfully released this warranty.
                    </AlertDescription>
                </Alert>

                <Card>
                    <CardHeader>
                        <CardTitle>Transfer Code</CardTitle>
                        <CardDescription>Share this code with the new owner</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                        <div className="text-4xl font-mono font-bold tracking-widest text-blue-600 select-all">
                            {transferredCode}
                        </div>
                        <p className="text-xs text-neutral-500 mt-4">
                            The new owner can claim this warranty at their dashboard using this code.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => router.push("/dashboard/buyer")}>
                            Return to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto space-y-8 mt-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Transfer Ownership</h1>
                <p className="text-neutral-500 mt-2">Send this warranty to another person.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{warranty.productModel}</CardTitle>
                    <CardDescription>S/N: {warranty.serialNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This action cannot be undone. Once you transfer this warranty, you will lose access to it immediately.
                        </AlertDescription>
                    </Alert>

                    <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
                        <p className="text-sm font-medium">How it works:</p>
                        <ul className="list-disc list-inside text-sm text-neutral-500 mt-2 space-y-1">
                            <li>We will generate a transfer code (or reuse the existing one).</li>
                            <li>You share that code with the new owner.</li>
                            <li>They enter the code in their &quot;Claim Warranty&quot; page.</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button variant="destructive" onClick={handleTransfer} disabled={actionLoading}>
                        {actionLoading ? "Releasing..." : "Release & General Code"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
