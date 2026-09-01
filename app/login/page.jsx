"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await loginUser({
                email,
                password,
            });

            router.push("/dashboard");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f3f0e8] text-[#171717] flex items-center justify-center p-5">

            <div className="w-full max-w-5xl min-h-[620px] bg-[#faf9f5] border border-[#d8d4ca] flex flex-col md:flex-row shadow-[8px_8px_0px_#171717]">

                {/* Left Section */}
                <section className="md:w-[48%] bg-[#171717] text-[#f3f0e8] p-8 md:p-12 flex flex-col justify-between">

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 border border-[#f3f0e8] flex items-center justify-center font-bold">
                                D
                            </div>

                            <span className="font-semibold tracking-wide">
                                DAILY FOCUS
                            </span>
                        </div>

                        <div className="mt-20">
                            <p className="text-[#e87532] text-sm font-semibold uppercase tracking-[0.2em] mb-5">
                                Stay on track
                            </p>

                            <h1 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight">
                                Make today
                                <br />
                                count.
                            </h1>

                            <p className="mt-7 max-w-sm text-[#b9b6ae] leading-7">
                                A simple place to organize your tasks,
                                keep your priorities clear and get things
                                done without the noise.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="h-px bg-[#3b3b3b] mb-4" />

                        <p className="text-xs text-[#85827b] uppercase tracking-widest">
                            Focus • Plan • Finish
                        </p>
                    </div>

                </section>


                {/* Right Section */}
                <section className="md:w-[52%] p-8 md:p-14 flex items-center">

                    <div className="w-full max-w-md mx-auto">

                        <div className="mb-10">
                            <p className="text-sm text-[#77736b] mb-3">
                                Welcome back
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight">
                                Sign in to your account
                            </h2>

                            <p className="text-[#77736b] mt-2 text-sm">
                                Pick up where you left off.
                            </p>
                        </div>


                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-transparent border-b-2 border-[#c9c5bb] px-1 py-3 text-base outline-none focus:border-[#e87532] transition"
                                />
                            </div>


                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-semibold"
                                    >
                                        Password
                                    </label>

                                    <span className="text-xs text-[#99958c]">
                                        Keep it safe
                                    </span>
                                </div>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-transparent border-b-2 border-[#c9c5bb] px-1 py-3 text-base outline-none focus:border-[#e87532] transition"
                                />
                            </div>


                            {error && (
                                <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3">
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#e87532] hover:bg-[#d96422] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-5 transition flex items-center justify-center gap-3"
                            >
                                {loading ? "Signing in..." : "Sign in"}

                                {!loading && (
                                    <span className="text-xl leading-none">
                                        →
                                    </span>
                                )}
                            </button>

                        </form>


                        <p className="text-center text-sm text-[#77736b] mt-8">
                            New here?{" "}
                            <a
                                href="/signup"
                                className="text-[#171717] font-semibold underline underline-offset-4 hover:text-[#e87532]"
                            >
                                Create an account
                            </a>
                        </p>

                    </div>

                </section>

            </div>

        </main>
    );
}