"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");

    const verificationStarted = useRef(false);

    useEffect(() => {
        if (verificationStarted.current) {
            return;
        }

        verificationStarted.current = true;

        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Verification token is missing.");
            return;
        }

        async function verifyEmail() {
            try {
                const response = await fetch(
                    `/api/auth/verify-email?token=${encodeURIComponent(token)}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setStatus("success");
                setMessage(data.message);
            } catch (error) {
                setStatus("error");
                setMessage(
                    error.message || "Email verification failed."
                );
            }
        }

        verifyEmail();
    }, [searchParams]);

    return (
        <main className="min-h-screen bg-[#f5f1e8] flex items-center justify-center px-6">
            <div className="w-full max-w-md border border-[#171717] bg-[#fffdf8] p-8 shadow-[8px_8px_0_#171717]">

                {status === "verifying" && (
                    <>
                        <h1 className="text-2xl font-black">
                            Verifying Email...
                        </h1>

                        <p className="mt-3 text-[#55514a]">
                            Please wait while we verify your email address.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h1 className="text-2xl font-black">
                            Email Verified ✓
                        </h1>

                        <p className="mt-3 text-[#55514a]">
                            {message}
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="mt-6 bg-[#171717] px-5 py-3 text-sm font-bold text-white hover:bg-[#e87532] transition"
                        >
                            Go to Login
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="text-2xl font-black">
                            Verification Failed
                        </h1>

                        <p className="mt-3 text-[#55514a]">
                            {message}
                        </p>

                        <button
                            onClick={() => router.push("/login")}
                            className="mt-6 bg-[#171717] px-5 py-3 text-sm font-bold text-white hover:bg-[#e87532] transition"
                        >
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}