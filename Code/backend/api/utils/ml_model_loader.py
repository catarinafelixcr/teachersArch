import os
import joblib
from datetime import datetime, timedelta
from django.utils.timezone import now
from api.models import AlunoGitlabAct

# Carregar os 5 modelos uma vez
MODEL_PATHS = {
    1: 'C:\\Users\\Miguel António\\Desktop\\pecd2025-pl2g4\\Code\\gitlabAPI_copy\\EnsembleModels\\Ensemble_interval1.pkl',
    2: 'C:\\Users\\Miguel António\\Desktop\\pecd2025-pl2g4\\Code\\gitlabAPI_copy\\EnsembleModels\\Ensemble_interval2.pkl',
    3: 'C:\\Users\\Miguel António\\Desktop\\pecd2025-pl2g4\\Code\\gitlabAPI_copy\\EnsembleModels\\Ensemble_interval3.pkl',
    4: 'C:\\Users\\Miguel António\\Desktop\\pecd2025-pl2g4\\Code\\gitlabAPI_copy\\EnsembleModels\\Ensemble_interval4.pkl',
    5: 'C:\\Users\\Miguel António\\Desktop\\pecd2025-pl2g4\\Code\\gitlabAPI_copy\\EnsembleModels\\Ensemble_interval5.pkl',
}

MODELS = {i: joblib.load(path) for i, path in MODEL_PATHS.items()}


def get_first_extraction_date(group):
    """
    Retorna a primeira data de extração do grupo (menor data_registo).
    """
    record = AlunoGitlabAct.objects.filter(group=group).order_by('data_registo').first()
    return record.data_registo if record else now()


def select_model(data_registo=None, grupo=None, stage=None):
    """
    Seleciona o modelo com base no 'stage' fornecido ou, se ausente, pela data da extração.
    """
    if stage:
        return MODELS.get(stage, MODELS[5])  # usa MODELS[5] como fallback seguro

    if not data_registo or not grupo:
        raise ValueError("É necessário fornecer 'data_registo' e 'grupo' se 'stage' não for especificado.")

    first_date = get_first_extraction_date(grupo)

    for i in range(5):
        start = first_date + timedelta(days=30 * i)
        end = start + timedelta(days=30)
        if start <= data_registo < end:
            return MODELS[i + 1]

    # Se já passaram mais de 5 meses, usa sempre o último modelo
    return MODELS[5]
