Loketassistent MVP – README

Overzicht
--------
Loketassistent is een eenvoudige MVP-tool voor architecten om projectgegevens in te vullen en een gestructureerd conceptantwoord te krijgen (dummy-LLM).
De app bestaat uit een Next.js frontend en een FastAPI backend die lokaal draaien.

Vereisten
---------
- Node.js + npm geïnstalleerd.
- Python 3 + virtualenv (venv).

Backend starten
---------------
1. Open een nieuwe terminal (cmd).
2. Ga naar de backend map:

   cd "C:\Users\aaron\OneDrive\Bureaublad\PlanMolder\WebApp\backend"

3. Activeer de virtualenv:

   venv\Scripts\activate.bat

4. Start de FastAPI server op poort 8000:

   python -m uvicorn main:app --reload --port 8000

- API base URL: http://localhost:8000
- Belangrijke endpoints:
  - POST /auth/register – dummy register.
  - POST /auth/login – dummy login (geeft access_token: "dummy-token").
  - POST /api/Loketassistent/generate – genereert dummy antwoord + velden:
    - answer
    - risks
    - required_documents
    - permit_likelihood
    - red_flags
    - meta

Frontend starten
----------------
1. Open een andere terminal (cmd).
2. Ga naar de frontend map:

   cd "C:\Users\aaron\OneDrive\Bureaublad\PlanMolder\WebApp\frontend"

3. Start de Next.js dev server:

   npm run dev -- --webpack

- Frontend URL: http://localhost:3000
- Belangrijke pagina’s:
  - /login – inloggen, zet Loketassistent_token in localStorage.
  - /tool – Loketassistent tool; alleen zichtbaar als er een token is.

Huidige functionaliteit
-----------------------
- Architect kan:
  - Projectnaam, type, beschrijving en oppervlakte ingeven in /tool.
  - Een gestructureerd dummy-antwoord zien met: hoofdantwoord, risico’s, vereiste documenten, kans op vergunning en red flags.

- Auth / MVP:
  - Dummy register/login zonder echte database (in-memory users in backend).
  - Token wordt in localStorage opgeslagen en client-side gecontroleerd.
  - /tool is client-side beschermd: zonder token ziet de gebruiker een melding “Log eerst in om Loketassistent te gebruiken” met link naar /login.

Bekende beperkingen (MVP)
-------------------------
- Geen echte database: users en projecten zijn niet persistent.
- Token en user-data zijn alleen client-side (localStorage) en niet veilig genoeg voor productie.
- Geen multi-user / multi-device support: alles is gebonden aan één browser.

Next steps (Logic Tree & LLM)
-----------------------------
- Stap 1: Echte LLM-call toevoegen in /api/Loketassistent/generate in plaats van dummy_llm_answer.
- Stap 2: Per veld (risks, required_documents, permit_likelihood, red_flags) een aparte logic tree uitwerken en voeden met LLM-output.
- Stap 3: Simpele logging in main.py uitbreiden naar gestructureerde logs (bijv. JSON) of een extern log-systeem.
- Stap 4: Database toevoegen voor users en projecten (bijv. PostgreSQL / Supabase / Firebase).
- Stap 5: Echte auth introduceren (NextAuth.js, Supabase Auth, Firebase Auth, Auth0, …) met veilige tokens/cookies.
- Stap 6: Projecthistoriek in de frontend tonen (lijst van recente projecten per gebruiker).
