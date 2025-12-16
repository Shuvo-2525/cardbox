"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, RefreshCw, Search, ArrowRight, Zap, Play } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { motion } from "framer-motion";

interface HomePageProps {
    dict: any;
}

export function HomePage({ dict }: HomePageProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col overflow-x-hidden">
            <Navbar dict={dict} />

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                {/* Background Gradients - Inspired by Login Page */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white dark:from-indigo-950/40 dark:via-neutral-950 dark:to-neutral-950" />
                    <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow" />
                    <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl opacity-50 dark:opacity-20 animate-pulse-slow delay-700" />
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 border border-indigo-100 dark:border-indigo-800"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        ডিজিটাল ওয়ারেন্টি এখন হাতের মুঠোয়
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold tracking-tight mb-6"
                    >
                        <span className="bg-gradient-to-r from-neutral-900 via-indigo-800 to-blue-900 dark:from-white dark:via-indigo-200 dark:to-blue-200 bg-clip-text text-transparent">
                            {dict.hero_title}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-10 leading-relaxed"
                    >
                        {dict.hero_subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Button asChild size="lg" className="rounded-2xl text-base h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5">
                            <Link href="/register/seller">
                                {dict.for_sellers} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-2xl text-base h-12 px-8 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:-translate-y-0.5">
                            <Link href="/login/buyer">
                                {dict.for_buyers}
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Hero Image / Abstract Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="mt-16 relative z-10 w-full max-w-5xl"
                    >
                        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl p-2 shadow-2xl shadow-indigo-500/10">
                            <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center relative">
                                {/* Placeholder for App Screenshot or Visual */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-20 mix-blend-overlay"></div>
                                <div className="text-center p-8">
                                    <div className="h-20 w-20 bg-indigo-100 dark:bg-indigo-900/40 rounded-3xl mx-auto flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
                                        <Zap className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Powerful Warranty Management</h3>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-neutral-50/50 dark:bg-neutral-900/50 relative">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">কিভাবে কাজ করে?</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-16">সহজ ৩টি ধাপে আপনার ডিজিটাল ওয়ারেন্টি যাত্রা শুরু করুন</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { step: "1", title: "ওয়ারেন্টি ইস্যু", desc: "বিক্রেতা খুব সহজেই ফোন নম্বর ও সিরিয়াল দিয়ে ওয়ারেন্টি কার্ড তৈরি করেন।" },
                            { step: "2", title: "ক্রেতার কাছে SMS", desc: "ক্রেতা সাথে সাথেই একটি ভেরিফিকেশন কোড ও লিংক SMS এর মাধ্যমে পেয়ে যান।" },
                            { step: "3", title: "যাচাই ও ক্লেইম", desc: "প্রয়োজনে ওয়েবসাইট থেকে যে কেউ ওয়ারেন্টি যাচাই বা ক্লেইম করতে পারেন।" },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl shadow-neutral-200/20 dark:shadow-none transform transition-transform group-hover:-translate-y-2 duration-300 pointer-events-none" />
                                <div className="relative p-8 space-y-6">
                                    <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mx-auto shadow-lg shadow-indigo-500/30">
                                        {item.step}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white dark:bg-neutral-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">কেন কার্ড বক্স?</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">আধুনিক ব্যবসার জন্য আধুনিক সমাধান</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<ShieldCheck className="h-6 w-6" />}
                            title={dict.feature_security_title}
                            desc={dict.feature_security_desc}
                            color="green"
                            delay={0}
                        />
                        <FeatureCard
                            icon={<RefreshCw className="h-6 w-6" />}
                            title={dict.feature_transfer_title}
                            desc={dict.feature_transfer_desc}
                            color="blue"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Search className="h-6 w-6" />}
                            title={dict.feature_verify_title}
                            desc={dict.feature_verify_desc}
                            color="purple"
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            <Footer dict={dict} />
        </div>
    );
}

function FeatureCard({ icon, title, desc, color, delay }: { icon: any, title: string, desc: string, color: string, delay: number }) {
    const colorClasses: any = {
        green: "bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600",
        blue: "bg-blue-100/50 dark:bg-blue-900/20 text-blue-600",
        purple: "bg-purple-100/50 dark:bg-purple-900/20 text-purple-600"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:shadow-2xl hover:shadow-neutral-200/40 dark:hover:shadow-none transition-all duration-300 group"
        >
            <div className={`h-14 w-14 rounded-2xl ${colorClasses[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}
