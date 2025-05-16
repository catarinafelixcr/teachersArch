import os
import joblib
from datetime import datetime, timedelta
from django.utils.timezone import now
from api.models import AlunoGitlabAct
import logging # Import logging for better messages

# Configure basic logging
logging.basicConfig(level=logging.INFO) # You can set to DEBUG for more verbosity

PROJECT_CODE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

MODEL_PATHS = {
    1: os.path.join(PROJECT_CODE_DIR, 'gitlabAPI_Luciana', 'EnsembleModels', 'Ensemble_interval1.pkl'),
    2: os.path.join(PROJECT_CODE_DIR, 'gitlabAPI_Luciana', 'EnsembleModels', 'Ensemble_interval2.pkl'),
    3: os.path.join(PROJECT_CODE_DIR, 'gitlabAPI_Luciana', 'EnsembleModels', 'Ensemble_interval3.pkl'),
    4: os.path.join(PROJECT_CODE_DIR, 'gitlabAPI_Luciana', 'EnsembleModels', 'Ensemble_interval4.pkl'),
    5: os.path.join(PROJECT_CODE_DIR, 'gitlabAPI_Luciana', 'EnsembleModels', 'Ensemble_interval5.pkl'),
}


'''MODEL_PATHS = {
    1: os.path.join(PROJECT_CODE_DIR, 'api','utils', 'modelo_intervalo1.pkl'),
    2: os.path.join(PROJECT_CODE_DIR, 'api','utils', 'modelo_intervalo2.pkl'),
    3: os.path.join(PROJECT_CODE_DIR, 'api', 'utils','modelo_intervalo3.pkl'),
    4: os.path.join(PROJECT_CODE_DIR, 'api','utils', 'modelo_intervalo4.pkl'),
    5: os.path.join(PROJECT_CODE_DIR, 'api','utils','modelo_intervalo5.pkl'),
}'''


# Carregar os modelos
MODELS = {}
all_models_loaded = True
for i, path in MODEL_PATHS.items():
    try:
        logging.info(f"Attempting to load model {i} from: {path}")
        if not os.path.exists(path):
            logging.error(f"File NOT FOUND for model {i} at path: {path}")
            MODELS[i] = None # Explicitly mark as not loaded or skip adding
            all_models_loaded = False
            continue
        MODELS[i] = joblib.load(path)
        logging.info(f"Successfully loaded model {i}.")
    except FileNotFoundError: # Should be caught by os.path.exists, but good to keep
        logging.error(f"FileNotFoundError for model {i} from path: {path}")
        MODELS[i] = None
        all_models_loaded = False
    except Exception as e:
        logging.error(f"Error loading model {i} from {path}: {e}")
        MODELS[i] = None
        all_models_loaded = False

# Remove None entries if you prefer to check with .get() or 'in'
MODELS = {k: v for k, v in MODELS.items() if v is not None}

logging.info(f"Loaded models: {list(MODELS.keys())}")
if not all_models_loaded:
    logging.warning("One or more models failed to load. Check paths and file integrity.")

# It's critical that model 5 (the fallback) is loaded if other logic depends on it.
if 5 not in MODELS:
    logging.critical("CRITICAL: Fallback model 5 FAILED to load. Application might not work as expected.")
    # Depending on your application's needs, you might want to raise an error here
    # raise RuntimeError("Fallback model 5 could not be loaded. Application cannot start.")


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
    # Fallback model key
    FALLBACK_MODEL_KEY = 5 # Or choose another default if 5 is not always available

    if stage:
        model = MODELS.get(stage)
        if model:
            return model
        logging.warning(f"Stage {stage} model not found. Using fallback model.")
        if FALLBACK_MODEL_KEY in MODELS:
            return MODELS[FALLBACK_MODEL_KEY]
        else:
            logging.error(f"Fallback model {FALLBACK_MODEL_KEY} also not available for stage {stage}!")
            # Handle this critical error: raise exception or return None/default behavior
            raise ValueError(f"Model for stage {stage} and fallback model {FALLBACK_MODEL_KEY} are unavailable.")


    if not data_registo or not grupo:
        raise ValueError("É necessário fornecer 'data_registo' e 'grupo' se 'stage' não for especificado.")

    first_date = get_first_extraction_date(grupo)

    for i in range(5): # i will be 0, 1, 2, 3, 4
        model_key_to_try = i + 1
        start = first_date + timedelta(days=30 * i)
        end = start + timedelta(days=30)
        if start <= data_registo < end:
            if model_key_to_try in MODELS:
                return MODELS[model_key_to_try]
            else:
                logging.warning(f"Model {model_key_to_try} not found for date range. Using fallback.")
                if FALLBACK_MODEL_KEY in MODELS:
                    return MODELS[FALLBACK_MODEL_KEY]
                else:
                    logging.error(f"Fallback model {FALLBACK_MODEL_KEY} also not available for date range!")
                    raise ValueError(f"Model {model_key_to_try} and fallback model {FALLBACK_MODEL_KEY} are unavailable.")


    # Se já passaram mais de 5 meses, usa sempre o último modelo (ou fallback)
    logging.info("Date is beyond 5 months. Using fallback model.")
    if FALLBACK_MODEL_KEY in MODELS:
        return MODELS[FALLBACK_MODEL_KEY]
    else:
        logging.error(f"Fallback model {FALLBACK_MODEL_KEY} not available for 'beyond 5 months' case!")
        raise ValueError(f"Fallback model {FALLBACK_MODEL_KEY} is unavailable.")
    


