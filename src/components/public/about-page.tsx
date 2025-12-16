"use client";

import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { motion } from "framer-motion";
import { Box, Target, Users, Leaf } from "lucide-react";

interface AboutPageProps {
    dict: any;
}

export function AboutPage({ dict }: AboutPageProps) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col">
            <Navbar dict={dict} />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-28 overflow-hidden bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl mx-auto space-y-6"
                        >
                            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                <Box className="h-8 w-8" />
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                                {dict.about_title}
                            </h1>
                            <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {dict.about_desc}
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <AboutCard
                                icon={<Leaf className="h-6 w-6" />}
                                title="পরিবেশবান্ধব"
                                desc="কাগজের ব্যবহার কমিয়ে আমরা পরিবেশ রক্ষায় ভূমিকা রাখছি। ডিজিটাল ওয়ারেন্টি একটি টেকসই সমাধান।"
                                delay={0.1}
                            />
                            <AboutCard
                                icon={<Target className="h-6 w-6" />}
                                title="আমাদের লক্ষ্য"
                                desc="ওয়ারেন্টি ব্যবস্থাপনা সহজ, নিরাপদ এবং স্বচ্ছ করা। গ্রাহক এবং বিক্রেতা উভয়ের জন্যই একটি নির্ভরযোগ্য প্ল্যাটফর্ম তৈরি করা।"
                                delay={0.2}
                            />
                            <AboutCard
                                icon={<Users className="h-6 w-6" />}
                                title="গ্রাহক সেবা"
                                desc="আমরা সর্বদাই আমাদের গ্রাহকদের সর্বোচ্চ সেবা প্রদানে প্রতিশ্রুতিবদ্ধ। আপনাদের সন্তুষ্টিই আমাদের অনুপ্রেরণা।"
                                delay={0.3}
                            />
                        </div>

                        <div className="mt-20 p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 to-blue-900 text-white text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl font-bold mb-6">কেন কার্ড বক্স?</h2>
                                <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                                    প্রথাগত কাগজের ওয়ারেন্টি কার্ড হারিয়ে ফেলা খুব সহজ। আমাদের লক্ষ্য হলো এই সমস্যাটি সমাধান করা এবং একই সাথে পরিবেশ রক্ষা করা। কার্ড বক্সের মাধ্যমে, আপনার সমস্ত পণ্যের ওয়ারেন্টি ডিজিটালি সংরক্ষিত থাকে, যা কখনো হারাবে না বা নষ্ট হবে না।
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer dict={dict} />
        </div>
    );
}

function AboutCard({ icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="p-8 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors shadow-sm"
        >
            <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-900 dark:text-neutral-100 mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}
