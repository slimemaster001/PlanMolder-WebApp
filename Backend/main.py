from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

# CORS instellen zodat je Next.js frontend (poort 3000) mag praten met deze API
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # of ["*"] tijdens dev als je het simpel wilt houden
    allow_credentials=True,
    allow_methods=["*"],        # belangrijk: laat OPTIONS toe voor preflight
    allow_headers=["*"],
)


class ProjectInput(BaseModel):
    project_name: str
    description: str
    area_m2: float


@app.get("/")
def root():
    return {"message": "PlanMolder backend werkt"}


@app.post("/api/generate-answers")
def generate_answers(data: ProjectInput):
    return {
        "summary": f"Samenvatting voor {data.project_name}",
        "advies": "Dit is nog een test-antwoord. Straks komt hier echte AI-logica bij.",
        "loket_choices": {
            "bouwtype": "Nieuwbouw (dummy)",
            "categorie": "A (dummy)",
        },
    }
