from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import *
from saw_service import SAWService

app = FastAPI(title="SAW Decision Making Service")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Para el frontend de Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

saw_service = SAWService()

@app.post("/api/saw/evaluate", response_model=SAWResult)
async def evaluate_alternatives(input_data: SAWInput):
    try:
        # Validaciones básicas
        if not input_data.criteria:
            raise HTTPException(status_code=400, detail="No criteria provided")
        if not input_data.alternatives:
            raise HTTPException(status_code=400, detail="No alternatives provided")
        
        # Verificar que todas las alternativas tengan el mismo número de valores que criterios
        n_criteria = len(input_data.criteria)
        for alt in input_data.alternatives:
            if len(alt.values) != n_criteria:
                raise HTTPException(
                    status_code=400,
                    detail=f"Alternative {alt.name} has incorrect number of values"
                )
        
        # Procesar la evaluación
        result = saw_service.evaluate_alternatives(input_data)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "SAW Decision Making Service"}