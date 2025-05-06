# Code/gitlabAPI/train_ensemble.py

import os
import pickle
import pandas as pd
from sklearn.ensemble import VotingRegressor, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_regression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Caminho base para os ficheiros CSV dos intervalos
BASE_PATH = "data/intermediate/"  # ajusta se necessário

def load_data(intervalo):
    path = os.path.join(BASE_PATH, f"features_interval_{intervalo}.csv")
    df = pd.read_csv(path)
    X = df.drop(columns=["Final Grade"])
    y = df["Final Grade"]
    return train_test_split(X, y, test_size=0.2, random_state=42)

def build_pipeline():
    ensemble = VotingRegressor(estimators=[
        ('rf', RandomForestRegressor(n_estimators=100, random_state=42)),
        ('gb', GradientBoostingRegressor(n_estimators=100, random_state=42)),
        ('ridge', Ridge(alpha=1.0))
    ])

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('select', SelectKBest(score_func=f_regression, k=10)),
        ('regressor', ensemble)
    ])
    return pipeline

def train_and_save(intervalo):
    print(f"\n--- Intervalo {intervalo} ---")
    X_train, X_test, y_train, y_test = load_data(intervalo)
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)

    # Avaliação
    print(f"R²: {r2_score(y_test, y_pred):.4f}")
    print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f}")
    print(f"MSE: {mean_squared_error(y_test, y_pred):.2f}")

    # Guardar modelo
    model_path = f"Code/gitlabAPI/Ensemble_interval{intervalo}.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(pipeline, f)
    print(f"Modelo guardado em: {model_path}")

if __name__ == "__main__":
    for intervalo in range(1, 6):
        train_and_save(intervalo)
