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
      const response = await fetch("http://127.0.0.1:8000/api/generate-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectName,
          description: description,
          area_m2: areaNumber,
        }),
      });

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-2">
          PlanMolder – Omgevingsloket MVP
        </h1>
        <p className="text-slate-300 mb-6">
          Vul basisinfo in over je project en klik op &quot;Genereer antwoorden&quot;.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Projectnaam"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
            required
          />

          <textarea
            placeholder="Korte beschrijving van het project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded bg-slate-900 border border-slate-700 min-h-[100px]"
            required
          />

          <input
            type="number"
            placeholder="Oppervlakte in m²"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="px-3 py-2 rounded bg-slate-900 border border-slate-700"
            required
          />

          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 font-semibold"
          >
            Genereer antwoorden
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded bg-slate-900 border border-slate-700">
            <h2 className="text-xl font-semibold mb-2">Resultaat</h2>
            <p className="mb-2">
              <span className="font-semibold">Samenvatting:</span>{" "}
              {result.summary}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Advies:</span> {result.advies}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Bouwtype:</span>{" "}
              {result.loket_choices.bouwtype}
            </p>
            <p>
              <span className="font-semibold">Categorie:</span>{" "}
              {result.loket_choices.categorie}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
