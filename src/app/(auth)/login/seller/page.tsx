"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Box, ShieldCheck, TrendingUp, Zap, Mail, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SellerLoginPage() {
    const { loginWithEmail } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await loginWithEmail(email, password);
        } catch (err: any) {
            setError(err.message || "Failed to login");
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
                className="hidden xl:flex w-1/2 bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 relative overflow-hidden flex-col justify-between items-start p-12 text-white"
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
                        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl"
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
                        Elevate your <br /> <span className="text-blue-200">business warranty.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-blue-100 text-lg leading-relaxed"
                    >
                        Issue, track, and manage product warranties with a tamper-proof digital system designed for modern commerce.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                            <ShieldCheck className="h-7 w-7 mb-3 text-blue-200" />
                            <h3 className="font-semibold text-lg">Tamper Proof</h3>
                            <p className="text-sm text-blue-100/70 mt-1">Blockchain-ready security</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                            <TrendingUp className="h-7 w-7 mb-3 text-blue-200" />
                            <h3 className="font-semibold text-lg">Sales Analytics</h3>
                            <p className="text-sm text-blue-100/70 mt-1">Real-time performance</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="relative z-10 text-sm font-medium text-blue-200/60"
                >
                    &copy; 2025 Card Box Platform. All rights reserved.
                </motion.div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <div className="w-full xl:w-1/2 flex flex-col relative bg-neutral-50/50 dark:bg-neutral-900/50">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header Action */}
                <div className="absolute top-8 left-8 z-20">
                    <Button variant="ghost" asChild className="gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white/50 dark:hover:bg-neutral-800/50">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back
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
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Seller Dashboard</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                                Securely access your warranty management tools.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1">Work Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <Input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-neutral-900 dark:text-white"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Password</label>
                                        <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Forgot?</Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
                                        <Input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-neutral-900 dark:text-white"
                                            placeholder="••••••••"
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

                            <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                        Verifying...
                                    </span>
                                ) : (
                                    "Sign In to Dashboard"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                New to Card Box?{" "}
                                <Link href="/register/seller" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
                                    Apply for a Partner Account
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-6 text-xs text-neutral-400">
                        <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                        <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
