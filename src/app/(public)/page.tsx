import { getDictionary } from "@/lib/i18n";
import { HomePage } from "@/components/public/home-page";

export default async function Home() {
  const dict = await getDictionary("bn");

  return <HomePage dict={dict} />;
}
