"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    userRole: "buyer" | "seller" | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<"buyer" | "seller" | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch role
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role as "buyer" | "seller");
                    }
                } catch (err) {
                    console.error("Error fetching user role:", err);
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);

            // Try to create/fetch user doc, but don't block login if it fails (e.g. offline)
            try {
                const userDocRef = doc(db, "users", result.user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    await setDoc(userDocRef, {
                        email: result.user.email,
                        role: "buyer",
                        createdAt: new Date().toISOString()
                    });
                    setUserRole("buyer");
                } else {
                    setUserRole(userDoc.data().role as "buyer" | "seller");
                }
            } catch (firestoreError) {
                console.error("Firestore connectivity issue:", firestoreError);
                // Assume buyer for google auth if firestore fails temporarily
                setUserRole("buyer");
            }

            router.push("/dashboard/buyer");
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // Role fetching handled by onAuthStateChanged, but we can optimistically set or wait
            // Route to seller by default for email login as per app flow
            router.push("/dashboard/seller");
        } catch (error) {
            console.error("Error logging in", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, pass: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pass);
            // Create user doc as seller
            await setDoc(doc(db, "users", result.user.uid), {
                email: result.user.email,
                role: "seller",
                createdAt: new Date().toISOString()
            });
            setUserRole("seller");
            router.push("/dashboard/seller");
        } catch (error) {
            console.error("Error registering", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserRole(null);
            router.push("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userRole, loading, signInWithGoogle, loginWithEmail, registerWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
