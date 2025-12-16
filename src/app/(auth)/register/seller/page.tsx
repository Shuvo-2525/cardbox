"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Box, ShieldCheck, TrendingUp, Zap, Mail, Lock, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SellerRegisterPage() {
    const { registerWithEmail } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await registerWithEmail(email, password);
        } catch (err: any) {
            setError(err.message || "Failed to register");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex bg-white dark:bg-neutral-950 overflow-hidden">
            {/* Left Panel - Hero Visuals */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden xl:flex w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-800 relative overflow-hidden flex-col justify-between items-start p-12 text-white"
            >
                {/* Abstract Background Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 40, 0],
                            x: [0, 30, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-3xl"
                    />
                </div>

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-lg border border-white/20">
                            <Box className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Card Box</span>
                    </motion.div>
                </div>

                <div className="relative z-10 space-y-8 max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-5xl font-bold leading-tight tracking-tight"
                    >
                        Join the future of <br /> <span className="text-purple-200">digital warranty.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-purple-100 text-lg leading-relaxed"
                    >
                        Create your partner account to start issuing secure, trackable warranties for your products.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                            <ShieldCheck className="h-7 w-7 mb-3 text-purple-200" />
                            <h3 className="font-semibold text-lg">Secure Issue</h3>
                            <p className="text-sm text-purple-100/70 mt-1">Fraud-proof system</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                            <TrendingUp className="h-7 w-7 mb-3 text-purple-200" />
                            <h3 className="font-semibold text-lg">Grow Sales</h3>
                            <p className="text-sm text-purple-100/70 mt-1">Build customer trust</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="relative z-10 text-sm font-medium text-purple-200/60"
                >
                    &copy; 2025 Card Box Platform.
                </motion.div>
            </motion.div>

            {/* Right Panel - Register Form */}
            <div className="w-full xl:w-1/2 flex flex-col relative bg-neutral-50/50 dark:bg-neutral-900/50">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header Action */}
                <div className="absolute top-8 left-8 z-20">
                    <Button variant="ghost" asChild className="gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white/50 dark:hover:bg-neutral-800/50">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>

                <div className="absolute top-8 right-8 z-20">
                    <span className="text-sm text-neutral-500 mr-2">Already a partner?</span>
                    <Button variant="ghost" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-semibold">
                        <Link href="/login/seller">
                            Sign In
                        </Link>
                    </Button>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl shadow-indigo-100/50 dark:shadow-none rounded-3xl p-6 sm:p-8 border border-neutral-100 dark:border-neutral-800"
                    >
                        <div className="text-center space-y-3 mb-8">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Create Partner Account</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                Start managing digital warranties for your business.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1">Business Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <Input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-neutral-900 dark:text-white"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <Input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-neutral-900 dark:text-white"
                                            placeholder="Min. 6 characters"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <Input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-neutral-900 dark:text-white"
                                            placeholder="Repeat password"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 border border-red-100 dark:border-red-900/20"
                                >
                                    <Zap className="h-4 w-4 fill-current shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <Button type="submit" className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center">
                            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                                By registering, you agree to our <Link href="#" className="underline hover:text-purple-600 text-neutral-500">Terms of Service</Link> and <Link href="#" className="underline hover:text-purple-600 text-neutral-500">Privacy Policy</Link>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
