import { getDictionary } from "@/lib/i18n";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { VerifyForm } from "@/components/public/verify-form";

export default async function VerifyPage() {
    const dict = await getDictionary("bn");

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-sans flex flex-col">
            <Navbar dict={dict} />

            <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
                <div className="max-w-2xl w-full space-y-8 text-center">
                    <h1 className="text-4xl font-bold">{dict.verify_warranty}</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        {dict.feature_verify_desc}
                    </p>

                    <VerifyForm dict={dict} />
                </div>
            </main>

            <Footer dict={dict} />
        </div>
    );
}

