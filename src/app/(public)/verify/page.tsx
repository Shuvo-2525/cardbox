import { getDictionary } from "@/lib/i18n";
import { VerifyPage } from "@/components/public/verify-page";

export default async function Page() {
    const dict = await getDictionary("bn");

    return <VerifyPage dict={dict} />;
}
