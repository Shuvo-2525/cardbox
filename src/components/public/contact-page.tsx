"use client";

import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

interface ContactPageProps {
    dict: any;
}

export function ContactPage({ dict }: ContactPageProps) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col">
            <Navbar dict={dict} />

            <main className="flex-1 container mx-auto px-4 py-20 relative">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[500px] -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/20 pointer-events-none" />

                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">

                    {/* Left Panel: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full md:w-1/3 space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">{dict.contact_title}</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
                                {dict.contact_desc}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <ContactItem icon={<Mail className="h-5 w-5" />} title="ইমেইল" content="support@cardbox.com.bd" />
                            <ContactItem icon={<Phone className="h-5 w-5" />} title="ফোন" content="+880 1234 567890" />
                            <ContactItem icon={<MapPin className="h-5 w-5" />} title="অফিস" content="Dhaka, Bangladesh" />
                        </div>
                    </motion.div>

                    {/* Right Panel: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full md:w-2/3"
                    >
                        <form className="space-y-6 bg-white dark:bg-neutral-800/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xl shadow-neutral-200/20 dark:shadow-none">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500">নাম</label>
                                    <Input placeholder="আপনার নাম" className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500">ইমেইল</label>
                                    <Input type="email" placeholder="আপনার ইমেইল" className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-wider text-neutral-500">বার্তা</label>
                                <textarea
                                    className="flex min-h-[160px] w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"
                                    placeholder="আপনার বার্তা লিখুন..."
                                />
                            </div>

                            <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                                <Send className="h-4 w-4 mr-2" />
                                বার্তা পাঠান
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </main>

            <Footer dict={dict} />
        </div>
    );
}

function ContactItem({ icon, title, content }: { icon: any, title: string, content: string }) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-0.5">{content}</p>
            </div>
        </div>
    )
}
