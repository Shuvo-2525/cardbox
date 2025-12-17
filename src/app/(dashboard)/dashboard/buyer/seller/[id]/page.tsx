"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Mail, Phone, ShieldCheck, BadgeCheck, Facebook, Instagram, Twitter, Linkedin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SellerProfile {
    businessName: string;
    email: string;
    photoURL?: string; // User profile photo
    logoUrl?: string; // Company logo from settings
    supportPhone?: string; // From settings
    address?: string; // From settings
    description?: string; // From settings
    website?: string; // From settings
    brandColor?: string; // From settings
    socials?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        linkedin?: string;
    };
    openingHours?: string;
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

    const brandColor = seller.brandColor || "#4F46E5";

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Cover / Header */}
            <div
                className="relative h-48 sm:h-64 rounded-xl overflow-hidden"
                style={{ background: `linear-gradient(to right, ${brandColor}, ${brandColor}dd)` }}
            >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-6 left-6 flex items-end gap-6">
                    <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-xl rounded-2xl bg-white">
                        <AvatarImage src={seller.logoUrl || seller.photoURL} className="object-contain p-1" />
                        <AvatarFallback className="text-4xl font-bold text-indigo-600 rounded-none bg-white">
                            {seller.businessName?.charAt(0) || "S"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="mb-2 text-white">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight shadow-black/20 drop-shadow-lg">
                            {seller.businessName}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 opacity-90">
                            {seller.isVerified ? (
                                <>
                                    <BadgeCheck className="h-5 w-5 text-blue-200" />
                                    <span className="font-medium">Verified Official Seller</span>
                                </>
                            ) : (
                                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">Seller Profile</span>
                            )}
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
                            {seller.address && (
                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                                    <span className="text-neutral-600 dark:text-neutral-300">
                                        {seller.address}
                                    </span>
                                </div>
                            )}

                            {seller.supportPhone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-neutral-400" />
                                    <span className="text-neutral-600 dark:text-neutral-300">
                                        {seller.supportPhone}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-neutral-400" />
                                <span className="text-neutral-600 dark:text-neutral-300 break-all">
                                    {seller.email}
                                </span>
                            </div>

                            {seller.website && (
                                <div className="pt-2">
                                    <Button asChild variant="outline" className="w-full justify-start text-indigo-600 border-indigo-100 dark:border-indigo-900/30 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10 hover:bg-indigo-100">
                                        <Link href={seller.website} target="_blank" rel="noopener noreferrer">
                                            Visit Website
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            <hr className="border-neutral-100 dark:border-neutral-800" />

                            {/* Socials */}
                            {seller.socials && Object.values(seller.socials).some(v => v) && (
                                <div className="flex gap-2 justify-center pb-2">
                                    {seller.socials.facebook && (
                                        <Link href={seller.socials.facebook} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                                            <Facebook className="h-4 w-4" />
                                        </Link>
                                    )}
                                    {seller.socials.instagram && (
                                        <Link href={seller.socials.instagram} target="_blank" className="p-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors">
                                            <Instagram className="h-4 w-4" />
                                        </Link>
                                    )}
                                    {seller.socials.twitter && (
                                        <Link href={seller.socials.twitter} target="_blank" className="p-2 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors">
                                            <Twitter className="h-4 w-4" />
                                        </Link>
                                    )}
                                    {seller.socials.linkedin && (
                                        <Link href={seller.socials.linkedin} target="_blank" className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Hours */}
                            {seller.openingHours && (
                                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-neutral-400" /> Opening Hours
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                                        {seller.openingHours}
                                    </p>
                                </div>
                            )}

                            <div className="pt-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 w-full justify-center py-1">
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
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                {seller.description || (
                                    <>
                                        This is the official digital profile for <strong>{seller.businessName}</strong>.
                                        By visiting this page, you can verify the identity of the seller who issued your warranty.
                                        We are committed to providing authentic products and reliable after-sales support.
                                    </>
                                )}
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
