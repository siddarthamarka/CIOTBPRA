import numpy as np
import os
import tensorflow as tf
from config.settings import settings

MODEL_PATH = os.path.join(settings.BASE_DIR, "SPMR_Model.h5")
LABELS     = ["Normal", "Alert", "Warning", "Emergency"]

# Scaler values from training output — update after retraining
SCALER_MEAN  = np.array([120.0, 80.0, 75.0])
SCALER_STD   = np.array([20.0,  12.0, 15.0])

try:
    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False,
        safe_mode=False
    )
    print("✅ ML Model Loaded Successfully")
except Exception as e:
    print(f"❌ Model Loading Failed: {e}")
    model = None

def predict_bp(sbp: int, dbp: int, hr: int) -> str:
    try:
        if model is None:
            return "Alert"
        X    = np.array([[sbp, dbp, hr]], dtype=float)
        X    = (X - SCALER_MEAN) / SCALER_STD
        pred = model.predict(X, verbose=0)
        return LABELS[int(np.argmax(pred))]
    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        return "Alert"