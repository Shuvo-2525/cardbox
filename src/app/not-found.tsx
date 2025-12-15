import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
            <div className="text-center">
                <h1 className="text-9xl font-black text-neutral-200 dark:text-neutral-800">404</h1>
                <div className="mt-[-50px]">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Page not found</h2>
                    <p className="text-neutral-500 mt-2 mb-6">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
                    <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
