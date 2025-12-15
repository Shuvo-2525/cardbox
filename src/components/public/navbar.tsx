"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar({ dict }: { dict: any }) {
    const { user, userRole, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {dict.app_name}
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
                    <Link href="/" className="hover:text-blue-600 transition-colors">
                        {dict.nav_home}
                    </Link>
                    <Link href="/verify" className="hover:text-blue-600 transition-colors">
                        Verify
                    </Link>
                    <Link href="/about" className="hover:text-blue-600 transition-colors">
                        {dict.nav_about}
                    </Link>

                    <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-2" />

                    {!loading && user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-normal text-neutral-500">
                                {user.displayName ? `Hi, ${user.displayName.split(' ')[0]}` : 'Welcome'}
                            </span>
                            <Button asChild size="sm" className="rounded-full bg-green-600 hover:bg-green-700">
                                <Link href={userRole === 'seller' ? "/dashboard/seller" : "/dashboard/buyer"}>
                                    Dashboard
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login/seller" className="hover:text-blue-600 transition-colors">
                                {dict.nav_seller_login}
                            </Link>
                            <Button asChild size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
                                <Link href="/login/buyer">{dict.nav_buyer_login}</Link>
                            </Button>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 space-y-4">
                    <Link href="/" className="block py-2 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                        {dict.nav_home}
                    </Link>
                    <Link href="/verify" className="block py-2 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                        Verify
                    </Link>
                    <Link href="/about" className="block py-2 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                        {dict.nav_about}
                    </Link>
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2" />
                    {!loading && user ? (
                        <Button asChild size="lg" className="w-full rounded-full bg-green-600 hover:bg-green-700">
                            <Link href={userRole === 'seller' ? "/dashboard/seller" : "/dashboard/buyer"}>
                                Go to Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Button asChild variant="outline" size="sm" className="w-full justify-center">
                                <Link href="/login/seller">{dict.nav_seller_login}</Link>
                            </Button>
                            <Button asChild size="sm" className="w-full justify-center bg-blue-600">
                                <Link href="/login/buyer">{dict.nav_buyer_login}</Link>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
