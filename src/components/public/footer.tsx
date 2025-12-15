import Link from "next/link";

export function Footer({ dict }: { dict: any }) {
    return (
        <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm text-neutral-500">
                    © {new Date().getFullYear()} {dict.app_name}. {dict.footer_rights}
                </div>
                <div className="flex gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    <Link href="#" className="hover:text-blue-600 transition-colors">{dict.footer_privacy}</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">{dict.footer_terms}</Link>
                </div>
            </div>
        </footer>
    );
}
