import { getDictionary } from "@/lib/i18n";
import { ContactPage } from "@/components/public/contact-page";

export default async function Contact() {
    const dict = await getDictionary("bn");

    return <ContactPage dict={dict} />;
}
