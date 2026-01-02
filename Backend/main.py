from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("loketassistent")


# CORS zodat http://localhost:3000 met je API mag praten
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy in-memory database
fake_users_db: dict[str, dict] = {}

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class LoketassistentRequest(BaseModel):
    project_name: str
    project_type: str
    description: str
    area: str | None = None


def dummy_llm_answer(payload: LoketassistentRequest, user: dict | None = None) -> str:
    username = user["username"] if user else "onbekende gebruiker"

    base = (
        f"Loketassistent concept-antwoord voor {payload.project_name} "
        f"({payload.project_type}), aangevraagd door {username}.\n\n"
        f"Beschrijving:\n{payload.description}\n\n"
    )

    if payload.area:
        base += f"Geschatte oppervlakte: {payload.area} m².\n\n"

    base += (
        "Dit is een dummy antwoord vanuit de test-LLM.\n"
        "Later komt hier echte logica op basis van je echte modellen en data."
    )
    return base

@app.post("/auth/register")
def register_user(body: RegisterRequest):
    # check of email al bestaat
    if body.email in fake_users_db:
        raise HTTPException(status_code=400, detail="E-mail bestaat al")

    fake_users_db[body.email] = {
        "username": body.username,
        "email": body.email,
        "password": body.password,  # in het echt: gehashed opslaan!
    }

    return {
        "message": "Account aangemaakt (dummy)",
        "user": {
            "username": body.username,
            "email": body.email,
        },
    }

@app.post("/auth/login")
def login_user(body: LoginRequest):
    user = fake_users_db.get(body.email)
    if not user or user["password"] != body.password:
        raise HTTPException(status_code=401, detail="Ongeldige login")

    # in echt scenario zou je hier een JWT token genereren
    return {
        "message": "Ingelogd (dummy)",
        "user": {
            "username": user["username"],
            "email": user["email"],
        },
        "access_token": "dummy-token",
    }

from typing import List, Optional  # bovenaan bij imports

class LoketassistentResponse(BaseModel):
    answer: str
    risks: Optional[List[str]] = None
    required_documents: Optional[List[str]] = None
    permit_likelihood: Optional[str] = None
    red_flags: Optional[List[str]] = None
    meta: dict | None = None

@app.post("/api/Loketassistent/generate", response_model=LoketassistentResponse)
def Loketassistent_generate(body: LoketassistentRequest):
    
    # simpele logging van input
    logger.info(
        "Loketassistent generate called",
        extra={
            "project_name": body.project_name,
            "project_type": body.project_type,
            "area": body.area,
        },
    )
    
    # later kun je hier bv. user uit token halen
    user = None

    answer = dummy_llm_answer(body, user=user)

    return LoketassistentResponse(
        answer=answer,
        risks=[
            "Mogelijke parkeerproblematiek in de straat",
            "Beperkte afstand tot perceelsgrens",
        ],
        required_documents=[
            "Volledig ingevuld omgevingsvergunningsformulier",
            "Recent uittreksel uit het kadaster",
        ],
        permit_likelihood="Waarschijnlijk, mits goede motivering",
        red_flags=[
            "Controleer lokale RUP-regels voor bouwhoogte",
        ],
        meta={
            "model": "dummy-llm-v0",
            "source": "in-memory",
        },
    )

