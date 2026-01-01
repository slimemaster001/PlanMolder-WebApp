"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ToolPage() {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setAnswer(null);
    setIsLoading(true);

    try {
      // token uit localStorage halen (als je net ingelogd bent)
      let token: string | null = null;
      if (typeof window !== "undefined") {
        token = window.localStorage.getItem("Loketassistent_token");
      }

      const res = await fetch(
        "http://localhost:8000/api/Loketassistent/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            project_name: projectName,
            project_type: projectType,
            description,
            area,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.detail || "Er ging iets mis bij Loketassistent"
        );
      }

      const data = await res.json();
      setAnswer(data.answer ?? JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Onbekende fout");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">
              Loketassistent
            </h1>
            <p className="text-xs text-zinc-400">
              Slimme assistent voor je loket‑ en vergunningsdossiers.
            </p>
          </div>

          <nav className="flex items-center gap-4 text-sm text-zinc-300">
            <Link href="/tool" className="hover:text-emerald-400">
              Tool
            </Link>
            <Link href="/login" className="hover:text-emerald-400">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row">
        {/* Formulier */}
        <section className="w-full md:w-1/2">
          <h2 className="mb-2 text-lg font-semibold">
            Projectgegevens
          </h2>
          <p className="mb-4 text-sm text-zinc-400">
            Vul de info in en laat Loketassistent concept‑antwoorden genereren
            voor je dossier.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Projectnaam
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Nieuwbouw eengezinswoning"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Type project
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="bv. verbouwing, nieuwbouw, meergezinswoning..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Beschrijving
              </label>
              <textarea
                required
                rows={4}
                className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Korte beschrijving van het project, context, bijzonderheden..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Oppervlakte (m²)
              </label>
              <input
                type="number"
                min={0}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="bv. 145"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {isLoading ? "Loketassistent is bezig..." : "Genereer antwoorden"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </section>

        {/* Antwoorden */}
        <section className="w-full md:w-1/2">
          <h2 className="mb-2 text-lg font-semibold">
            Antwoorden van Loketassistent
          </h2>
          <p className="mb-4 text-sm text-zinc-400">
            Hier verschijnen de gegenereerde concept‑antwoorden voor je dossier.
          </p>

          <div className="h-[320px] rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm overflow-auto whitespace-pre-wrap">
            {isLoading && !answer && (
              <p className="text-zinc-400">
                Loketassistent is aan het nadenken...
              </p>
            )}

            {!isLoading && !answer && !error && (
              <p className="text-zinc-500">
                Geen output nog. Vul het formulier in en klik op
                &ldquo;Genereer antwoorden&rdquo;.
              </p>
            )}

            {answer && (
              <p className="text-zinc-100">
                {answer}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
