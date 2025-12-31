"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const areaNumber = parseFloat(area || "0");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/generate-answers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_name: projectName,
            description: description,
            area_m2: areaNumber,
          }),
        }
      );

      if (!response.ok) {
        console.error("Backend error:", response.status);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Header / hero */}
        <header className="mb-8">
          <p className="text-sm font-mono text-emerald-400 mb-1">
            PlanMolder · MVP prototype
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Omgevingsloket assistent voor architecten.
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Vul snel de basisinfo van je project in en laat de AI je helpen met
            samenvatting, advies en de juiste loket‑categorieën. Dit is een
            vroege versie – de definitieve UI komt later.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Formulier */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 md:p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Projectgegevens</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-300">
                  Projectnaam
                </label>
                <input
                  type="text"
                  placeholder="Bijv. nieuwbouw ééngezinswoning Leuven"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-300">
                  Korte beschrijving
                </label>
                <textarea
                  placeholder="Omschrijf kort het programma, de locatie, context, belangrijke randvoorwaarden…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-300">
                  Oppervlakte in m²
                </label>
                <input
                  type="number"
                  placeholder="Bijv. 180"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  required
                  min={0}
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors"
              >
                Genereer antwoorden
              </button>
            </form>
          </section>

          {/* Resultaat */}
          <section className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 md:p-6 min-h-[160px]">
            <h2 className="text-lg font-semibold mb-3">Resultaat</h2>

            {!result && (
              <p className="text-sm text-slate-400">
                Nog geen resultaat. Vul links je project in en klik op
                <span className="font-semibold"> &quot;Genereer antwoorden&quot;</span>.
              </p>
            )}

            {result && (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 uppercase text-xs tracking-wide mb-1">
                    Samenvatting
                  </p>
                  <p className="text-slate-100">{result.summary}</p>
                </div>

                <div>
                  <p className="text-slate-400 uppercase text-xs tracking-wide mb-1">
                    Advies
                  </p>
                  <p className="text-slate-100">{result.advies}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="text-slate-400 uppercase text-xs tracking-wide mb-1">
                      Bouwtype
                    </p>
                    <p className="text-slate-100">
                      {result.loket_choices?.bouwtype}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase text-xs tracking-wide mb-1">
                      Categorie
                    </p>
                    <p className="text-slate-100">
                      {result.loket_choices?.categorie}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
