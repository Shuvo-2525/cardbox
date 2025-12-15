import { getDictionary } from "@/lib/i18n";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, RefreshCw, Search, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default async function Home() {
  const dict = await getDictionary("bn");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col">
      <Navbar dict={dict} />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-xs font-semibold mb-6 border border-blue-100 dark:border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            ডিজিটাল ওয়ারেন্টি এখন হাতের মুঠোয়
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent max-w-4xl">
            {dict.hero_title}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-10 leading-relaxed font-sans">
            {dict.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="rounded-full text-base h-12 px-8 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
              <Link href="/register/seller">
                {dict.for_sellers} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full text-base h-12 px-8 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Link href="/login/buyer">
                {dict.for_buyers}
              </Link>
            </Button>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">কিভাবে কাজ করে?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto">1</div>
              <h3 className="text-xl font-semibold">ওয়ারেন্টি ইস্যু</h3>
              <p className="text-neutral-600 dark:text-neutral-400">বিক্রেতা খুব সহজেই ফোন নম্বর ও সিরিয়াল দিয়ে ওয়ারেন্টি কার্ড তৈরি করেন।</p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto">2</div>
              <h3 className="text-xl font-semibold">ক্রেতার কাছে SMS</h3>
              <p className="text-neutral-600 dark:text-neutral-400">ক্রেতা সাথে সাথেই একটি ভেরিফিকেশন কোড ও লিংক SMS এর মাধ্যমে পেয়ে যান।</p>
            </div>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto">3</div>
              <h3 className="text-xl font-semibold">যাচাই ও ক্লেইম</h3>
              <p className="text-neutral-600 dark:text-neutral-400">প্রয়োজনে ওয়েবসাইট থেকে যে কেউ ওয়ারেন্টি যাচাই বা ক্লেইম করতে পারেন।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{dict.feature_security_title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {dict.feature_security_desc}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-6">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{dict.feature_transfer_title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {dict.feature_transfer_desc}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 mb-6">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{dict.feature_verify_title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {dict.feature_verify_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer dict={dict} />
    </div>
  );
}
