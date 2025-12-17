"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Loader2, Save, Upload, Building2, Phone, Mail, MapPin, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
// If no toast lib installed, will use window.alert or basic UI state. Check layouts... 
// Checked imports in other files... seems no toast used yet?
// Actually, using window.alert is ugly. I'll stick to a status message state.

export default function SellerSettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        businessName: "",
        businessType: "retail",
        description: "",
        supportEmail: "",
        supportPhone: "",
        website: "",
        address: "",
        logoUrl: "", // Base64
        brandColor: "#indigo", // Simplified, or hex
        socials: { facebook: "", instagram: "", twitter: "", linkedin: "" },
        openingHours: ""
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setFormData({
                        businessName: data.businessName || "",
                        businessType: data.businessType || "retail",
                        description: data.description || "",
                        supportEmail: data.supportEmail || "",
                        supportPhone: data.supportPhone || "",
                        website: data.website || "",
                        address: data.address || "",
                        logoUrl: data.logoUrl || "",
                        brandColor: data.brandColor || "#6366f1",
                        socials: data.socials || { facebook: "", instagram: "", twitter: "", linkedin: "" },
                        openingHours: data.openingHours || ""
                    });
                    if (data.logoUrl) setLogoPreview(data.logoUrl);
                }
            } catch (error) {
                console.error("Error fetching settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            alert("File size should be less than 1MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setLogoPreview(base64String);
            setFormData(prev => ({ ...prev, logoUrl: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                ...formData,
                updatedAt: new Date()
            });
            // Show success (simple alert for now, can be upgraded)
            // Ideally use a Toast component if available in the codebase
            // Re-checked files, didn't see explicit Toast provider in layout.
            // Using a simple state message or native alert is safest.
            window.alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings", error);
            window.alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                    Manage your business profile and branding.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="profile">Profile & Contact</TabsTrigger>
                    <TabsTrigger value="branding">Branding & Logo</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
                        <CardHeader>
                            <CardTitle>Business Information</CardTitle>
                            <CardDescription>Public details about your company.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Business Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                                        <Input
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            className="pl-9"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Details</Label>
                                    <Input
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Electronics Retailer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://acme.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Support Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                                        <Input
                                            name="supportEmail"
                                            value={formData.supportEmail}
                                            onChange={handleInputChange}
                                            className="pl-9"
                                            placeholder="support@acme.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Support Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                                        <Input
                                            name="supportPhone"
                                            value={formData.supportPhone}
                                            onChange={handleInputChange}
                                            className="pl-9"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                                        <Textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="pl-9 min-h-[80px]"
                                            placeholder="123 Business St, City, Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <h3 className="md:col-span-2 text-lg font-medium">Social Media & Hours</h3>

                                <div className="space-y-2">
                                    <Label>Facebook</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-4 w-4 text-neutral-400 flex items-center justify-center font-bold text-xs">f</div>
                                        <Input
                                            name="socials.facebook"
                                            value={formData.socials?.facebook || ""}
                                            onChange={(e) => setFormData(prev => ({ ...prev, socials: { ...prev.socials, facebook: e.target.value } }))}
                                            className="pl-9"
                                            placeholder="facebook.com/page"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Instagram</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-4 w-4 text-neutral-400 flex items-center justify-center font-bold text-xs">Ig</div>
                                        <Input
                                            name="socials.instagram"
                                            value={formData.socials?.instagram || ""}
                                            onChange={(e) => setFormData(prev => ({ ...prev, socials: { ...prev.socials, instagram: e.target.value } }))}
                                            className="pl-9"
                                            placeholder="instagram.com/handle"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Twitter / X</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-4 w-4 text-neutral-400 flex items-center justify-center font-bold text-xs">X</div>
                                        <Input
                                            name="socials.twitter"
                                            value={formData.socials?.twitter || ""}
                                            onChange={(e) => setFormData(prev => ({ ...prev, socials: { ...prev.socials, twitter: e.target.value } }))}
                                            className="pl-9"
                                            placeholder="x.com/handle"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>LinkedIn</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-4 w-4 text-neutral-400 flex items-center justify-center font-bold text-xs">in</div>
                                        <Input
                                            name="socials.linkedin"
                                            value={formData.socials?.linkedin || ""}
                                            onChange={(e) => setFormData(prev => ({ ...prev, socials: { ...prev.socials, linkedin: e.target.value } }))}
                                            className="pl-9"
                                            placeholder="linkedin.com/company"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label>Opening Hours</Label>
                                    <Textarea
                                        name="openingHours"
                                        value={formData.openingHours || ""}
                                        onChange={handleInputChange}
                                        className="min-h-[100px]"
                                        placeholder="Mon-Fri: 9am - 6pm&#10;Sat: 10am - 4pm&#10;Sun: Closed"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="branding" className="space-y-6 mt-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
                        <CardHeader>
                            <CardTitle>Logo & Colors</CardTitle>
                            <CardDescription>Customize how your brand appears on warranties.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <Label>Company Logo</Label>
                                <div className="flex items-center gap-6">
                                    <div className="h-24 w-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center overflow-hidden relative group">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-neutral-400" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-xs font-medium">Change</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium">Upload Logo</h4>
                                        <p className="text-xs text-neutral-500 max-w-[200px]">
                                            Recommended size: 512x512px. Max size: 1MB. Formats: PNG, JPG.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Brand Color (Primary)</Label>
                                <div className="grid grid-cols-6 gap-3">
                                    {['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, brandColor: color }))}
                                            className={`h-10 w-10 rounded-full border-2 transition-all ${formData.brandColor === color
                                                ? 'border-neutral-900 dark:border-white scale-110'
                                                : 'border-transparent hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end">
                <Button size="lg" onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
