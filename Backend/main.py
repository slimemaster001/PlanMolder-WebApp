from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

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
            "categorie": "A (dummy)"
        }
    }
