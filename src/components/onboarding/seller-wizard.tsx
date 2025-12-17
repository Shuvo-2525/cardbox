"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Building2, MapPin, Palette, Loader2, Upload } from "lucide-react";

export function SellerOnboardingWizard() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        businessName: "",
        tradeLicense: "",
        taxId: "",
        description: "",
        address: "",
        supportEmail: "",
        supportPhone: "",
        website: "",
        brandColor: "#4F46E5", // Default Indigo
        logoUrl: ""
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    // Handle Image Upload (Base64 for simplicity/reliability without Storage rules)
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (limit to 1MB)
            if (file.size > 1024 * 1024) {
                alert("File size is too large. Please upload an image under 1MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                ...formData,
                onboardingCompleted: true,
                updatedAt: new Date().toISOString()
            });
            // Redirect to dashboard
            router.push("/dashboard/seller");
        } catch (error) {
            console.error("Error saving onboarding data:", error);
        }
        setLoading(false);
    };

    const steps = [
        { id: 1, title: "Business Profile", icon: Building2, desc: "Tell us about your company" },
        { id: 2, title: "Location & Contact", icon: MapPin, desc: "How customers can reach you" },
        { id: 3, title: "Branding", icon: Palette, desc: "Make your warranty cards shine" },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="grid lg:grid-cols-12 gap-8 min-h-[600px] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-100 dark:border-neutral-800 overflow-hidden">

                {/* Sidebar / Progress */}
                <div className="lg:col-span-4 bg-neutral-50 dark:bg-neutral-950 p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-900/10 dark:to-purple-900/10 pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-2 mb-10">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <Building2 className="text-white h-5 w-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">Seller Setup</span>
                        </div>

                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[19px] top-4 bottom-8 w-0.5 bg-neutral-200 dark:bg-neutral-800 -z-10" />

                            {steps.map((s, i) => {
                                const Icon = s.icon;
                                const isActive = s.id === step;
                                const isCompleted = s.id < step;

                                return (
                                    <div key={s.id} className="flex items-start gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 
                                            ${isActive ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30' :
                                                    isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-400'}`}
                                        >
                                            {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                        </div>
                                        <div className={`mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                            <h3 className={`text-sm font-bold ${isActive ? 'text-indigo-900 dark:text-indigo-300' : 'text-neutral-900 dark:text-neutral-100'}`}>
                                                {s.title}
                                            </h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-[150px] leading-relaxed">
                                                {s.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-xs text-neutral-400 dark:text-neutral-600 mt-8">
                        Step {step} of {totalSteps}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 p-8 md:p-12 flex flex-col relative">
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            {steps[step - 1].title}
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                            Please provide your business details to continue.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto px-1 -mx-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Step 1: Business Profile */}
                                {step === 1 && (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Business Legal Name</label>
                                            <Input
                                                placeholder="e.g. Acme Electronics Ltd."
                                                value={formData.businessName}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                className="h-12 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Trade License Number</label>
                                            <Input
                                                placeholder="TRAD/DSCC/..."
                                                value={formData.tradeLicense}
                                                onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })}
                                                className="h-12 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Tax ID (BIN/TIN)</label>
                                            <Input
                                                placeholder="123456789"
                                                value={formData.taxId}
                                                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                                className="h-12 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Business Description</label>
                                            <textarea
                                                placeholder="Briefly describe your business..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="flex min-h-[120px] w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-3 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Location & Contact */}
                                {step === 2 && (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Headquarters Address</label>
                                            <Input
                                                placeholder="Full street address"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="h-12 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Support Email</label>
                                            <Input
                                                type="email"
                                                placeholder="support@company.com"
                                                value={formData.supportEmail}
                                                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                                                className="h-12 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Support Phone</label>
                                            <Input
                                                type="tel"
                                                placeholder="+880 1..."
                                                value={formData.supportPhone}
                                                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                                                className="h-12 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Website (Optional)</label>
                                            <Input
                                                placeholder="https://..."
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                                className="h-12 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Branding */}
                                {step === 3 && (
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 block">Brand Color</label>
                                            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
                                                <div className="flex flex-wrap gap-4">
                                                    {["#4F46E5", "#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444", "#a855f7", "#ec4899", "#000000"].map((color) => (
                                                        <button
                                                            key={color}
                                                            onClick={() => setFormData({ ...formData, brandColor: color })}
                                                            className={`w-12 h-12 rounded-full border-4 shadow-sm transition-all duration-300 ${formData.brandColor === color ? 'border-white dark:border-neutral-800 shadow-lg scale-110 ring-2 ring-indigo-500' : 'border-transparent hover:scale-110'}`}
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                    <div className="flex-1 min-w-[120px] relative group">
                                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                            <Palette className="h-4 w-4 text-neutral-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="w-full h-12 pl-10 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-sm uppercase"
                                                            value={formData.brandColor}
                                                            onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                                                        />
                                                        <input
                                                            type="color"
                                                            className="absolute right-2 top-2 h-8 w-8 opacity-0 cursor-pointer"
                                                            value={formData.brandColor}
                                                            onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                                                        />
                                                        <div className="absolute right-3 top-3 h-6 w-6 rounded-full border border-neutral-200 pointer-events-none" style={{ backgroundColor: formData.brandColor }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 block">Company Logo</label>

                                            <div
                                                className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer group relative"
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />

                                                <div className="flex flex-col items-center justify-center text-center">
                                                    {formData.logoUrl ? (
                                                        <div className="mb-4 relative h-32 w-32 object-contain bg-white dark:bg-neutral-800 rounded-xl p-2 shadow-sm border border-neutral-100">
                                                            <img
                                                                src={formData.logoUrl}
                                                                alt="Logo Preview"
                                                                className="h-full w-full object-contain"
                                                            />
                                                            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-md">
                                                                <Check className="h-3 w-3" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                                            <Upload className="h-8 w-8" />
                                                        </div>
                                                    )}

                                                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                                        {formData.logoUrl ? "Click to replace logo" : "Click to upload your logo"}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        SVG, PNG, JPG (Max 1MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1 || loading}
                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 h-12 rounded-xl px-6"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        <Button
                            onClick={step === totalSteps ? handleSubmit : handleNext}
                            disabled={loading}
                            className={`min-w-[160px] h-12 rounded-xl text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 ${loading ? 'opacity-80' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {!loading && step === totalSteps ? "Launch Dashboard" : "Continue"}
                            {!loading && step !== totalSteps && <ChevronRight className="h-4 w-4 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ensure "lucide-react" imports are available or use default imports if necessary
