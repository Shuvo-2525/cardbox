import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ContactPage() {
    const dict = await getDictionary("bn");

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col">
            <Navbar dict={dict} />

            <main className="flex-1 container mx-auto px-4 py-20">
                <div className="max-w-xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-4">{dict.contact_title}</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-center mb-12">
                        {dict.contact_desc}
                    </p>

                    <form className="space-y-6 bg-white dark:bg-neutral-800 p-8 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-lg">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">নাম</label>
                            <Input placeholder="আপনার নাম" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ইমেইল</label>
                            <Input type="email" placeholder="আপনার ইমেইল" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">বার্তা</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="আপনার বার্তা লিখুন..."
                            />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            বার্তা পাঠান
                        </Button>
                    </form>

                    <div className="mt-12 text-center text-neutral-600 dark:text-neutral-400">
                        <p>ইমেইল: support@cardbox.com.bd</p>
                        <p>ফোন: +880 1234 567890</p>
                    </div>
                </div>
            </main>

            <Footer dict={dict} />
        </div>
    );
}
