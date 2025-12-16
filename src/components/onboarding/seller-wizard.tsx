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
        logoUrl: "" // Placeholder for now
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
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
        { id: 1, title: "Business Profile", icon: Building2 },
        { id: 2, title: "Location & Contact", icon: MapPin },
        { id: 3, title: "Branding", icon: Palette },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Progress Steps */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-100 dark:bg-neutral-800 -z-10" />
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-300"
                        style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                    />

                    {steps.map((s) => {
                        const Icon = s.icon;
                        const isActive = s.id === step;
                        const isCompleted = s.id < step;

                        return (
                            <div key={s.id} className="flex flex-col items-center gap-2 bg-white dark:bg-neutral-950 px-2">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: isActive || isCompleted ? "#4F46E5" : "#F4F4F5",
                                        color: isActive || isCompleted ? "#FFFFFF" : "#71717A",
                                        scale: isActive ? 1.1 : 1
                                    }}
                                    className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-neutral-950 shadow-sm transition-colors duration-300"
                                >
                                    {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                                </motion.div>
                                <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-400"}`}>
                                    {s.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-neutral-900 shadow-2xl shadow-neutral-200/50 dark:shadow-none border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 min-h-[500px] flex flex-col relative overflow-hidden">
                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <h2 className="text-3xl font-bold mb-2">{steps[step - 1].title}</h2>
                <p className="text-neutral-500 dark:text-neutral-400 mb-8">Please provide your business details to continue.</p>

                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Step 1: Business Profile */}
                            {step === 1 && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Business Legal Name</label>
                                        <Input
                                            placeholder="e.g. Acme Electronics Ltd."
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Trade License Number</label>
                                        <Input
                                            placeholder="TRAD/DSCC/..."
                                            value={formData.tradeLicense}
                                            onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tax ID (BIN/TIN)</label>
                                        <Input
                                            placeholder="123456789"
                                            value={formData.taxId}
                                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Business Description</label>
                                        <textarea
                                            placeholder="Briefly describe your business..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Location & Contact */}
                            {step === 2 && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Headquarters Address</label>
                                        <Input
                                            placeholder="Full street address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Support Email</label>
                                        <Input
                                            type="email"
                                            placeholder="support@company.com"
                                            value={formData.supportEmail}
                                            onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Support Phone</label>
                                        <Input
                                            type="tel"
                                            placeholder="+880 1..."
                                            value={formData.supportPhone}
                                            onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Website (Optional)</label>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Branding */}
                            {step === 3 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium block">Brand Color</label>
                                        <div className="flex flex-wrap gap-4">
                                            {["#4F46E5", "#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444", "#a855f7", "#ec4899", "#000000"].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setFormData({ ...formData, brandColor: color })}
                                                    className={`w-12 h-12 rounded-full border-2 transition-all ${formData.brandColor === color ? 'border-neutral-900 ring-2 ring-neutral-200 scale-110' : 'border-transparent hover:scale-110'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                            <div className="flex-1 min-w-[120px]">
                                                <input
                                                    type="color"
                                                    className="w-full h-12 rounded-xl cursor-pointer"
                                                    value={formData.brandColor}
                                                    onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-medium block">Company Logo</label>
                                        <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer group">
                                            <div className="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white transition-colors shadow-sm">
                                                <Upload className="h-8 w-8 text-neutral-400" />
                                            </div>
                                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-1">SVG, PNG, JPG (Max 2MB)</p>
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
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <Button
                        onClick={step === totalSteps ? handleSubmit : handleNext}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] rounded-xl h-12 shadow-lg shadow-indigo-500/25"
                    >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {!loading && step === totalSteps ? "Complete Setup" : "Continue"}
                        {!loading && step !== totalSteps && <ChevronRight className="h-4 w-4 ml-2" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Ensure "lucide-react" imports are available or use default imports if necessary
