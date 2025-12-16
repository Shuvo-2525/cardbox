"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Mail, Phone, ShieldCheck, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SellerProfile {
    businessName: string;
    email: string;
    photoURL?: string;
    contactPhone?: string;
    contactAddress?: string;
    branding?: {
        logo?: string;
        color?: string;
    };
    isVerified?: boolean;
}

export default function SellerProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeller = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "users", id);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setSeller(snap.data() as SellerProfile);
                } else {
                    console.error("Seller not found");
                }
            } catch (error) {
                console.error("Error fetching seller", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeller();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-8 pb-12">
                <Skeleton className="h-40 w-full rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-[300px]" />
                    <Skeleton className="h-6 w-[200px]" />
                </div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <Building2 className="h-16 w-16 text-neutral-300 mb-4" />
                <h1 className="text-2xl font-bold">Seller Not Found</h1>
                <p className="text-neutral-500 mt-2">The shop profile you are looking for does not exist.</p>
                <Button asChild className="mt-6" variant="outline">
                    <Link href="/dashboard/buyer">Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Cover / Header */}
            <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-6 left-6 flex items-end gap-6">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-xl rounded-2xl bg-white">
                        <AvatarImage src={seller.photoURL} />
                        <AvatarFallback className="text-4xl font-bold text-indigo-600 rounded-none bg-white">
                            {seller.businessName?.charAt(0) || "S"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="mb-2 text-white">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight shadow-black/20 drop-shadow-lg">
                            {seller.businessName}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 opacity-90">
                            <BadgeCheck className="h-5 w-5 text-blue-200" />
                            <span className="font-medium">Verified Official Seller</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Left Column: Contact & Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-none shadow-md bg-white dark:bg-neutral-900 sticky top-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Shop Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {seller.contactAddress && (
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                                    <span className="text-neutral-600 dark:text-neutral-300">
                                        {seller.contactAddress}
                                    </span>
                                </div>
                            )}

                            {seller.contactPhone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-neutral-400" />
                                    <span className="text-neutral-600 dark:text-neutral-300">
                                        {seller.contactPhone}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-neutral-400" />
                                <span className="text-neutral-600 dark:text-neutral-300 break-all">
                                    {seller.email}
                                </span>
                            </div>

                            <hr className="border-neutral-100 dark:border-neutral-800" />

                            <div className="pt-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    Trusted Partner
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: About / Overview */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm h-full bg-white dark:bg-neutral-900">
                        <CardHeader>
                            <CardTitle>About Us</CardTitle>
                            <CardDescription>
                                Official warranty provider and retailer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                This is the official digital profile for <strong>{seller.businessName}</strong>.
                                By visiting this page, you can verify the identity of the seller who issued your warranty.
                                We are committed to providing authentic products and reliable after-sales support.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700/50">
                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Authentic Products</h3>
                                    <p className="text-xs text-neutral-500">100% genuine products sourced directly from manufacturers.</p>
                                </div>
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700/50">
                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Digital Warranty Support</h3>
                                    <p className="text-xs text-neutral-500">Full paperless warranty claims support for all eligible items.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
