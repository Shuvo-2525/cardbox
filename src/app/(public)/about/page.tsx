import { getDictionary } from "@/lib/i18n";
import { AboutPage } from "@/components/public/about-page";

export default async function About() {
    const dict = await getDictionary("bn");

    return <AboutPage dict={dict} />;
}
