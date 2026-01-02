"use client";

import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type PreviousCase = {
  id: string;
  name: string;
  type: string;
  location?: string;
  createdAt: string;
};

type DossierLink = {
  key: string;
  label: string;
  href: string | null;
  description: string;
};

const DOSSIER_LINKS: DossierLink[] = [
  {
    key: "aanvraag_omgevingsproject",
    label: "Aanvraag omgevingsproject",
    href: "/tool/aanvraag-omgevingsproject",
    description: "Stedenbouwkundig dossier (nieuwbouw, verbouwing, ...).",
  },
  // de rest blijft gewoon zichtbare maar disabled blokken
  {
    key: "melding_omgevingsproject",
    label: "Melding omgevingsproject",
    href: null,
    description: "Eenvoudige meldingen, binnenkort beschikbaar.",
  },
  {
    key: "aanvraag_nieuwe_verkaveling",
    label: "Aanvraag nieuwe verkaveling",
    href: null,
    description: "Verkavelingsaanvragen, binnenkort beschikbaar.",
  },
  {
    key: "bijstelling_verkaveling",
    label: "Bijstelling bestaande verkaveling",
    href: null,
    description: "Aanpassen van bestaande verkavelingsvergunning.",
  },
  {
    key: "bijstelling_voorwaarden_exploitant",
    label: "Bijstelling voorwaarden (exploitant)",
    href: null,
    description: "Aanpassen milieuvoorwaarden door vergunninghouder.",
  },
  {
    key: "bijstelling_voorwaarden_niet_exploitant",
    label: "Bijstelling voorwaarden (niet‑exploitant)",
    href: null,
    description: "Aanvraag door derde partij, binnenkort.",
  },
  {
    key: "bijstelling_klasse3",
    label: "Bijstelling milieuvoorwaarden klasse 3",
    href: null,
    description: "Kleine ingedeelde inrichtingen, binnenkort.",
  },
  {
    key: "afwijking_minister",
    label: "Afwijking milieuvoorwaarden bij minister",
    href: null,
    description: "Zware dossiers, later.",
  },
  {
    key: "overdracht_vergunning",
    label: "Overdracht vergunning ingedeelde inrichting",
    href: null,
    description: "Overdracht milieu‑vergunning, later.",
  },
  {
    key: "mededeling_ontzetting",
    label: "Mededeling ontzetting milieuvergunning",
    href: null,
    description: "Specifieke milieu‑procedure, later.",
  },
  {
    key: "melding_stopzetting",
    label: "Melding stopzetting / verval vergunning",
    href: null,
    description: "Beëindigen van ingedeelde inrichting.",
  },
  {
    key: "schorsing_opheffing",
    label: "Schorsing of opheffing vergunning",
    href: null,
    description: "Opschorten of opheffen van vergunning.",
  },
  {
    key: "aangifte_bronmaatregelen",
    label: "Aangifte vrijstellingsregeling bronmaatregelen",
    href: null,
    description: "Specifieke bronmaatregelen, later.",
  },
];

export default function ToolIndexPage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [previousCases, setPreviousCases] = useState<PreviousCase[]>([]);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [modalProjectName, setModalProjectName] = useState("");
  const [modalReference, setModalReference] = useState("");
  const [modalLocation, setModalLocation] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("Loketassistent_token");
      setHasToken(!!token);

      // TODO: vervang dit door echte fetch naar je backend
      const mock: PreviousCase[] = [
        {
          id: "123",
          name: "Nieuwbouw eengezinswoning",
          type: "Aanvraag omgevingsproject",
          location: "Leuven",
          createdAt: "2026-01-02",
        },
        {
          id: "124",
          name: "Verbouwing eengezinswoning",
          type: "Aanvraag omgevingsproject",
          location: "Kortenberg",
          createdAt: "2025-12-20",
        },
      ];
      setPreviousCases(mock);
    }
  }, []);

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

  function openAanvraagModal() {
    setModalError(null);
    setModalProjectName("");
    setModalReference("");
    setModalLocation("");
    setShowModal(true);
  }

  function handleModalSubmit(e: FormEvent) {
    e.preventDefault();
    setModalError(null);

    if (!modalProjectName.trim() || !modalLocation.trim()) {
      setModalError("Projectnaam en locatie zijn verplicht.");
      return;
    }

    const params = new URLSearchParams();
    params.set("name", modalProjectName.trim());
    if (modalReference.trim()) params.set("ref", modalReference.trim());
    params.set("loc", modalLocation.trim());

    setShowModal(false);

    router.push(`/tool/aanvraag-omgevingsproject?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Loketassistent</h1>
            <p className="text-xs text-zinc-400">
              Kies een type loketdossier en bekijk je vorige dossiers.
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

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* LINKERKOLOM: lijst van alle dossier‑types */}
          <section>
            <h2 className="mb-2 text-lg font-semibold">Alle dossier‑types</h2>
            <p className="mb-4 text-sm text-zinc-400">
              Kies een type om een nieuw dossier te starten. Types zonder link
              zijn al zichtbaar, maar nog niet actief.
            </p>

            <div className="space-y-2">
              {DOSSIER_LINKS.map((dossier) => {
                if (dossier.key === "aanvraag_omgevingsproject") {
                  // Deze opent de modal i.p.v. directe link
                  return (
                    <button
                      key={dossier.key}
                      type="button"
                      onClick={openAanvraagModal}
                      className="w-full text-left rounded-xl border border-emerald-500/60 bg-zinc-900 px-4 py-3 text-sm hover:border-emerald-400 hover:bg-zinc-900/80 transition"
                    >
                      <div className="font-semibold text-emerald-300">
                        {dossier.label}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        {dossier.description}
                      </p>
                    </button>
                  );
                }

                // overige types: zichtbaar maar disabled
                return (
                  <div
                    key={dossier.key}
                    className="block rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm opacity-70"
                  >
                    <div className="font-semibold text-zinc-300">
                      {dossier.label}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {dossier.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RECHTERKOLOM: vorige dossiers */}
          <section>
            <h2 className="mb-2 text-lg font-semibold">Vorige dossiers</h2>
            <p className="mb-4 text-sm text-zinc-400">
              Direct overzicht van recent aangemaakte dossiers. Later kun je
              hier ook downloaden.
            </p>

            {previousCases.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nog geen dossiers. Start links een nieuw dossier.
              </p>
            ) : (
              <div className="space-y-2">
                {previousCases.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-zinc-100 truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-zinc-500 truncate">
                        {c.type}
                        {c.location ? ` • ${c.location}` : ""} • {c.createdAt}
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs shrink-0">
                      <Link
                        href="/tool/aanvraag-omgevingsproject"
                        className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                      >
                        Openen
                      </Link>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* MODAL voor Aanvraag omgevingsproject */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100 mb-1">
              Nieuw dossier: Aanvraag omgevingsproject
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Vul de basisgegevens in. Je kunt deze later nog verfijnen in het
              dossier.
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-200 mb-1">
                  Projectnaam *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={modalProjectName}
                  onChange={(e) => setModalProjectName(e.target.value)}
                  placeholder="bv. Nieuwbouw eengezinswoning"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-200 mb-1">
                  Uw referentie (optioneel)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={modalReference}
                  onChange={(e) => setModalReference(e.target.value)}
                  placeholder="bv. Dossier 2026-001"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-200 mb-1">
                  Locatie / gemeente *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={modalLocation}
                  onChange={(e) => setModalLocation(e.target.value)}
                  placeholder="bv. Leuven, Tiensesteenweg ..."
                />
              </div>

              {modalError && (
                <p className="text-xs text-red-400">{modalError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-md bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-emerald-500 text-xs font-medium text-zinc-950 hover:bg-emerald-400"
                >
                  Start dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
