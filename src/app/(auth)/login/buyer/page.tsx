"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box, ShieldCheck, Smartphone, Zap, Check, WalletCards } from "lucide-react";
import { motion } from "framer-motion";

export default function BuyerLoginPage() {
    const { signInWithGoogle } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white dark:bg-neutral-950 overflow-hidden">
            {/* Left Panel - Hero Visuals */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden xl:flex w-1/2 bg-gradient-to-tr from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden flex-col justify-between items-start p-12 text-white"
            >
                {/* Abstract Background Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, 40, 0],
                            x: [0, -20, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-10%] right-[-20%] w-[700px] h-[700px] rounded-full bg-white/10 blur-3xl mix-blend-overlay"
                    />
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-300/20 blur-3xl"
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
                        Warranty in <br /> <span className="text-emerald-200">your pocket.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-emerald-50 text-lg leading-relaxed"
                    >
                        Never lose a warranty card again. Track expiries, transfer ownership, and claim service in one tap.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                            <Smartphone className="h-7 w-7 mb-3 text-emerald-200" />
                            <h3 className="font-semibold text-lg">Digital Wallet</h3>
                            <p className="text-sm text-emerald-100/70 mt-1">All brands in one app</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                            <Zap className="h-7 w-7 mb-3 text-emerald-200" />
                            <h3 className="font-semibold text-lg">Quick Transfer</h3>
                            <p className="text-sm text-emerald-100/70 mt-1">Sell & transfer instantly</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="relative z-10 text-sm font-medium text-emerald-100/60"
                >
                    &copy; 2025 Card Box Consumer.
                </motion.div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <div className="w-full xl:w-1/2 flex flex-col relative bg-neutral-50/50 dark:bg-neutral-900/50">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

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
                        className="w-full max-w-md space-y-6 text-center"
                    >
                        <div className="space-y-3">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400 shadow-sm transform -rotate-3">
                                <WalletCards className="h-8 w-8" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Welcome Back</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                                Sign in to access your digital warranties securely.
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/20"
                            >
                                <Zap className="h-4 w-4 fill-current" />
                                {error}
                            </motion.div>
                        )}

                        <div className="pt-4 space-y-4">
                            <Button
                                variant="outline"
                                className="w-full h-12 text-base gap-3 rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-lg shadow-neutral-200/40 dark:shadow-none hover:-translate-y-0.5"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                {/* Simple Google Icon SVG */}
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                {loading ? "Signing in..." : "Continue with Google"}
                            </Button>

                            <div className="flex items-center gap-2 justify-center text-xs text-neutral-400">
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span>Encrypted & Secured</span>
                            </div>
                        </div>

                        <p className="text-xs text-neutral-400 mt-8 max-w-xs mx-auto">
                            By continuing, you agree to our <Link href="#" className="underline hover:text-emerald-600 text-neutral-500">Terms of Service</Link> and <Link href="#" className="underline hover:text-emerald-600 text-neutral-500">Privacy Policy</Link>.
                        </p>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-6 text-xs text-neutral-400">
                        <span>&copy; {new Date().getFullYear()} Card Box</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
