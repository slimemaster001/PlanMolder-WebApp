"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type LoketassistentResponse = {
  answer: string;
  risks?: string[];
  required_documents?: string[];
  permit_likelihood?: string;
  red_flags?: string[];
  meta?: {
    model?: string;
    source?: string;
    path?: string[];
    [key: string]: any;
  };
};

export default function AanvraagOmgevingsprojectPage() {
  const searchParams = useSearchParams();
  const [hasToken, setHasToken] = useState(false);

  const initialName = searchParams.get("name") || "";
  const initialRef = searchParams.get("ref") || "";
  const initialLoc = searchParams.get("loc") || "";

  const [projectName, setProjectName] = useState(initialName);
  const [reference, setReference] = useState(initialRef);
  const [location, setLocation] = useState(initialLoc);
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<LoketassistentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("Loketassistent_token");
      setHasToken(!!token);
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setAnswer(null);
    setIsLoading(true);

    try {
      let token: string | null = null;
      if (typeof window !== "undefined") {
        token = window.localStorage.getItem("Loketassistent_token");
      }

      if (!token) {
        setError("Log eerst in om Loketassistent te gebruiken");
        setIsLoading(false);
        return;
      }

      if (!projectName.trim() || !location.trim()) {
        setError("Projectnaam en locatie zijn verplicht.");
        setIsLoading(false);
        return;
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
            project_name: projectName.trim(),
            project_reference: reference.trim() || null,
            location: location.trim(),
            project_type: "aanvraag_omgevingsproject",
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

      const data: LoketassistentResponse = await res.json();
      setAnswer(data);
      setPath(data.meta?.path || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Onbekende fout");
    } finally {
      setIsLoading(false);
    }
  }

  if (!hasToken) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 flex items-center justify-center p-8">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-800 p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border-2 border-emerald-500/30">
            <svg
              className="w-12 h-12 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-4">
            🔒 Loketassistent
          </h1>
          <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
            Log eerst in om Loketassistent te gebruiken.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Ga naar login
          </Link>
          <p className="mt-6 text-sm text-zinc-500">
            Heb je al een account?{" "}
            <Link
              href="/login"
              className="text-emerald-400 hover:underline font-medium"
            >
              Direct inloggen
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Titel: Type • Projectnaam • Referentie • Locatie
  const titleParts: string[] = ["Aanvraag omgevingsproject"];
  if (projectName.trim()) titleParts.push(projectName.trim());
  if (reference.trim()) titleParts.push(reference.trim());
  if (location.trim()) titleParts.push(location.trim());
  const titleLine = titleParts.join(" • ");

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/tool"
              className="inline-flex items-center text-xs text-zinc-400 hover:text-emerald-400 mb-1"
            >
              ← Terug naar dossieroverzicht
            </Link>
            <h1 className="text-sm font-medium text-zinc-300">
              {titleLine}
            </h1>
            <p className="text-xs text-zinc-500">
              Stedenbouwkundig traject voor aanvragen in het omgevingsloket.
            </p>
          </div>
          <nav className="flex gap-4 text-sm text-zinc-300">
            <Link href="/tool" className="hover:text-emerald-400">
              Tool
            </Link>
            <Link href="/login" className="hover:text-emerald-400">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Formulier */}
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Projectgegevens voor dit dossier
          </h2>
          <p className="mb-4 text-sm text-zinc-400">
            Pas de basisinfo aan of vul ze verder aan. Loketassistent gebruikt
            dit voor de logic‑tree.
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
                Uw referentie (optioneel)
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="bv. Dossier 2026-001"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Locatie / gemeente
              </label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="bv. Leuven, Tiensesteenweg ..."
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

        {/* Antwoorden + breadcrumb */}
        <section>
          {path.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-2 text-xs text-zinc-400 flex flex-wrap items-center gap-1"
            >
              {path.map((step, idx) => {
                const isLast = idx === path.length - 1;
                return (
                  <span key={idx} className="flex items-center gap-1">
                    {idx > 0 && (
                      <span className="text-zinc-600">{">"}</span>
                    )}
                    {isLast ? (
                      <span className="font-medium text-zinc-200">
                        {step}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="hover:text-emerald-400 underline-offset-2 hover:underline"
                      >
                        {step}
                      </button>
                    )}
                  </span>
                );
              })}
            </nav>
          )}

          <h2 className="mb-2 text-lg font-semibold">
            Antwoorden van Loketassistent
          </h2>
          <p className="mb-4 text-sm text-zinc-400">
            Hier komen de concept‑antwoorden, risico&apos;s en ontbrekende
            stukken voor dit aanvraag‑dossier.
          </p>

          <div className="min-h-[360px] rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm overflow-auto whitespace-pre-wrap">
            {isLoading && !answer && (
              <p className="text-zinc-400">
                Loketassistent is aan het nadenken...
              </p>
            )}

            {!isLoading && !answer && !error && (
              <p className="text-zinc-500">
                Nog geen output. Vul bovenaan de gegevens in en klik op
                &ldquo;Genereer antwoorden&rdquo;.
              </p>
            )}

            {answer && (
              <div className="space-y-4 text-zinc-100">
                <div>
                  <h3 className="font-semibold mb-1">Hoofdantwoord</h3>
                  <p className="text-sm text-zinc-200">
                    {answer.answer}
                  </p>
                </div>

                {answer.risks && answer.risks.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Risico&apos;s</h3>
                    <ul className="list-disc list-inside text-sm text-zinc-200">
                      {answer.risks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {answer.required_documents &&
                  answer.required_documents.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-1">
                        Vereiste documenten
                      </h3>
                      <ul className="list-disc list-inside text-sm text-zinc-200">
                        {answer.required_documents.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {answer.permit_likelihood && (
                  <div>
                    <h3 className="font-semibold mb-1">Kans op vergunning</h3>
                    <p className="text-sm text-zinc-200">
                      {answer.permit_likelihood}
                    </p>
                  </div>
                )}

                {answer.red_flags && answer.red_flags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Red flags</h3>
                    <ul className="list-disc list-inside text-sm text-zinc-200">
                      {answer.red_flags.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {answer.meta && (
                  <div>
                    <h3 className="font-semibold mb-1">Meta</h3>
                    <p className="text-xs text-zinc-400">
                      Model: {answer.meta.model ?? "onbekend"} • Source:{" "}
                      {answer.meta.source ?? "onbekend"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
