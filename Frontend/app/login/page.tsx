"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Login failed");
      }

      const data = await res.json();

      const token = data.access_token;
      if (typeof window !== "undefined" && token) {
        window.localStorage.setItem("Loketassistent_token", token);
      }

      setSuccess("Ingelogd! Je wordt doorgestuurd...");
      console.log("Login response:", data);

      window.location.href = "/tool";
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Er ging iets mis");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-zinc-50 mb-4">
          Login
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          Log in met je e-mail en wachtwoord.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">
              Wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 pr-10 text-sm text-zinc-50 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wachtwoord"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200"
                aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
              >
                {showPassword ? (
                  // "oog dicht" icoon (simple SVG)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-8 0-1.56.42-3.03 1.17-4.31" />
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" />
                    <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c5 0 9.27 3.11 11 8a11.8 11.8 0 0 1-2.16 3.64" />
                  </svg>
                ) : (
                  // "oog open" icoon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {isLoading ? "Bezig met inloggen..." : "Inloggen"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 text-sm text-emerald-400">
            {success}
          </p>
        )}

        <p className="mt-6 text-sm text-zinc-400">
          Nog geen account?{" "}
          <Link
            href="/register"
            className="text-emerald-400 hover:underline"
          >
            Maak er één aan
          </Link>
        </p>
      </div>
    </main>
  );
}
