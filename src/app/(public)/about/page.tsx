import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default async function AboutPage() {
    const dict = await getDictionary("bn");

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col">
            <Navbar dict={dict} />

            <main className="flex-1 container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold text-center mb-12">{dict.about_title}</h1>

                    <div className="prose dark:prose-invert prose-lg mx-auto">
                        <p className="lead text-xl text-neutral-600 dark:text-neutral-300 text-center">
                            {dict.about_desc}
                        </p>
                        <div className="my-12 p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
                            <h3 className="text-2xl font-bold mb-4">কেন কার্ড বক্স?</h3>
                            <p>
                                প্রথাগত কাগজের ওয়ারেন্টি কার্ড হারিয়ে ফেলা খুব সহজ। আমাদের লক্ষ্য হলো এই সমস্যাটি সমাধান করা এবং একই সাথে পরিবেশ রক্ষা করা। কার্ড বক্সের মাধ্যমে, আপনার সমস্ত পণ্যের ওয়ারেন্টি ডিজিটালি সংরক্ষিত থাকে, যা কখনো হারাবে না বা নষ্ট হবে না।
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer dict={dict} />
        </div>
    );
}
