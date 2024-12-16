from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np

from sklearn.tree import DecisionTreeClassifier

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Leer el dataset usando ; como separador
df = pd.read_csv('winequality.csv', sep=';')

# Preprocesar datos
X = df.drop('quality', axis=1)  # Nota las comillas dobles
y = df['quality']  # Nota las comillas dobles

# Limpiar nombres de columnas (quitar comillas)
X.columns = X.columns.str.replace('"', '')
y.name = y.name.replace('"', '')

# Normalizar datos
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

class DataPoint(BaseModel):
    features: List[float]
    label: str

class TrainRequest(BaseModel):
    data: List[DataPoint]
    maxDepth: int = 5
    minSamplesSplit: int = 2

class PredictRequest(BaseModel):
    features: List[float]

class DecisionTree:
    def __init__(self, max_depth=5, min_samples_split=2):
        self.model = DecisionTreeClassifier(
            max_depth=max_depth, 
            min_samples_split=min_samples_split,
            random_state=42
        )

    def fit(self, X, y):
        # Convertir X y y a numpy arrays
        X = np.array(X)
        y = np.array(y).astype(int)  # Convertir etiquetas a enteros
        
        # Entrenar el modelo
        self.model.fit(X, y)

    def predict(self, X):
    # Asegurar que X sea un array 2D
        if X.ndim == 1:
            X = X.reshape(1, -1)
    
    # Hacer predicción
        return str(self.model.predict(X)[0])

# Variable global para el modelo
model = None

@app.post("/api/datamining/train")
async def train(request: TrainRequest):
    global model
    try:
        X = [d.features for d in request.data]
        y = [d.label for d in request.data]
        
        model = DecisionTree(request.maxDepth, request.minSamplesSplit)
        model.fit(X, y)
        
        return {"message": "Model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/datamining/predict")
async def predict(request: PredictRequest):
    if model is None:
        raise HTTPException(status_code=400, detail="Model not trained")
    
    try:
        # Escalar las características
        features_scaled = scaler.transform([request.features])
        
        # Asegurarse de que las características estén en el formato correcto
        prediction = model.predict(features_scaled.reshape(1, -1)[0])
        
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/datamining/dataset-info")
async def get_dataset_info():
    return {
        "total_samples": len(df),
        "features": {
            "names": list(X.columns),
            "stats": {
                name: {
                    "mean": float(df[name].mean()),
                    "std": float(df[name].std()),
                    "min": float(df[name].min()),
                    "max": float(df[name].max())
                }
                for name in X.columns
            }
        },
        "target": {
            "name": "quality",
            "unique_values": sorted(y.unique().tolist()),
            "distribution": y.value_counts().to_dict()
        }
    }