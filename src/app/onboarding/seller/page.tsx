import { SellerOnboardingWizard } from "@/components/onboarding/seller-wizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seller Onboarding | Card Box",
    description: "Complete your seller profile to start issuing warranties",
};

export default function SellerOnboardingPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to Card Box</h1>
                <p className="text-neutral-500 dark:text-neutral-400">Let's get your partner account set up in minutes.</p>
            </div>

            <SellerOnboardingWizard />
        </div>
    );
}
