"use client";

import { useState } from "react";
import { signupUser } from "@/lib/api";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            await signupUser({
                name: username,
                email,
                password,
            });

            setMessage(
                "Please verify your email before logging in."
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f3f0e8] text-[#171717] flex items-center justify-center p-5">
            <div className="w-full max-w-5xl min-h-[620px] bg-[#faf9f5] border border-[#d8d4ca] flex flex-col md:flex-row-reverse shadow-[8px_8px_0px_#171717]">

                {/* Left Section */}

                <section className="md:w-[48%] bg-[#e87532] text-[#171717] p-8 md:p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 border-2 border-[#171717] flex items-center justify-center font-black">
                                D
                            </div>

                            <span className="font-bold tracking-wide">
                                DAILY FOCUS
                            </span>
                        </div>

                        <div className="mt-20">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-5">
                                Start fresh
                            </p>

                            <h1 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight">
                                Your day.
                                <br />
                                Your focus.
                            </h1>

                            <p className="mt-7 max-w-sm leading-7">
                                Create your workspace, organize your
                                priorities and turn scattered thoughts
                                into things you actually finish.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="h-px bg-[#171717]/30 mb-4" />

                        <p className="text-xs uppercase tracking-widest font-semibold">
                            One task at a time.
                        </p>
                    </div>
                </section>

                {/* Form Section */}

                <section className="md:w-[52%] p-8 md:p-14 flex items-center">
                    <div className="w-full max-w-md mx-auto">

                        <div className="mb-9">
                            <p className="text-sm text-[#77736b] mb-3">
                                Create your account
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight">
                                Let&apos;s get started
                            </h2>

                            <p className="text-[#77736b] mt-2 text-sm">
                                It only takes a minute.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Your username"
                                    required
                                    className="w-full bg-transparent border-b-2 border-[#c9c5bb] px-1 py-3 outline-none focus:border-[#e87532] transition"
                                />
                            </div>

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
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-transparent border-b-2 border-[#c9c5bb] px-1 py-3 outline-none focus:border-[#e87532] transition"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Create a password"
                                    required
                                    className="w-full bg-transparent border-b-2 border-[#c9c5bb] px-1 py-3 outline-none focus:border-[#e87532] transition"
                                />
                            </div>

                            {error && (
                                <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3">
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {message && (
                                <p className="mb-3 text-center text-sm font-semibold text-green-600">
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#171717] hover:bg-[#2a2a2a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-5 transition flex items-center justify-center gap-3"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}

                                {!loading && (
                                    <span className="text-xl leading-none">
                                        →
                                    </span>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-[#77736b] mt-8">
                            Already have an account?{" "}

                            <a
                                href="/login"
                                className="text-[#171717] font-semibold underline underline-offset-4 hover:text-[#e87532]"
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}