import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from tensorflow.keras import layers, models
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix

# ── Paths ────────────────────────────────────────────────
BASE_DIR   = os.getcwd()
DATA_PATH  = "/content/processed_bp_snapshot.csv"
MODEL_PATH = os.path.join(BASE_DIR, "SPMR_Model.h5")

# ── Load & Validate ───────────────────────────────────────
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

df = pd.read_csv(DATA_PATH)

REQUIRED_COLS = {"SBP", "DBP", "HR", "bp_label"}
if not REQUIRED_COLS.issubset(df.columns):
    raise ValueError(f"Missing columns. Found: {list(df.columns)}")

df = df.dropna(subset=["SBP", "DBP", "HR", "bp_label"])
print("Dataset shape:", df.shape)
print("Label distribution:\n", df["bp_label"].value_counts())

# ── Features & Labels ─────────────────────────────────────
X = df[["SBP", "DBP", "HR"]].values

LABEL_MAP = {"Normal": 0, "Alert": 1, "Warning": 2, "Emergency": 3}
CLASS_NAMES = ["Normal", "Alert", "Warning", "Emergency"]

y = df["bp_label"].map(LABEL_MAP).values

if np.isnan(y.astype(float)).any():
    raise ValueError("Some labels could not be mapped. Check bp_label column values.")

# ── Normalize Features ────────────────────────────────────
scaler = StandardScaler()
X = scaler.fit_transform(X)

print("Scaler mean:", scaler.mean_)
print("Scaler std: ", scaler.scale_)

# ── Train / Test Split ────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

y_train_cat = to_categorical(y_train, num_classes=4)
y_test_cat  = to_categorical(y_test,  num_classes=4)

# ── Model ─────────────────────────────────────────────────
model = models.Sequential([
    layers.Input(shape=(3,)),
    layers.Dense(128, activation="relu"),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(64, activation="relu"),
    layers.BatchNormalization(),
    layers.Dropout(0.2),
    layers.Dense(32, activation="relu"),
    layers.Dense(4, activation="softmax")
], name="SPMR_Model")

model.summary()

# ── Compile ───────────────────────────────────────────────
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# ── Callbacks ─────────────────────────────────────────────
callbacks = [
    EarlyStopping(
        monitor="val_loss",
        patience=8,
        restore_best_weights=True,
        verbose=1
    ),
    ModelCheckpoint(
        filepath=MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    )
]

# ── Train ─────────────────────────────────────────────────
history = model.fit(
    X_train, y_train_cat,
    epochs=100,
    batch_size=32,
    validation_data=(X_test, y_test_cat),
    callbacks=callbacks,
    verbose=1
)

# ── Evaluate ──────────────────────────────────────────────
loss, acc = model.evaluate(X_test, y_test_cat, verbose=0)
print(f"\nTest Loss:     {loss:.4f}")
print(f"Test Accuracy: {acc:.4f} ({acc*100:.2f}%)")

# ── Predictions ───────────────────────────────────────────
y_pred = np.argmax(model.predict(X_test), axis=1)

# ── Classification Report ─────────────────────────────────
print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=CLASS_NAMES
))

# ── Confusion Matrix ──────────────────────────────────────
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(8, 6))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Reds",
    xticklabels=CLASS_NAMES,
    yticklabels=CLASS_NAMES,
    linewidths=0.5,
    linecolor="black"
)
plt.title("Confusion Matrix — SPMR Model", fontsize=14, fontweight="bold")
plt.xlabel("Predicted Label", fontsize=12)
plt.ylabel("True Label", fontsize=12)
plt.tight_layout()
plt.savefig(os.path.join(BASE_DIR, "confusion_matrix.png"), dpi=150)
plt.show()
print("Confusion Matrix saved at:", os.path.join(BASE_DIR, "confusion_matrix.png"))

# ── Training Curves ───────────────────────────────────────
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

ax1.plot(history.history["accuracy"],     label="Train Acc")
ax1.plot(history.history["val_accuracy"], label="Val Acc")
ax1.set_title("Accuracy")
ax1.legend()
ax1.grid(True)

ax2.plot(history.history["loss"],     label="Train Loss")
ax2.plot(history.history["val_loss"], label="Val Loss")
ax2.set_title("Loss")
ax2.legend()
ax2.grid(True)

plt.tight_layout()
plt.savefig(os.path.join(BASE_DIR, "training_curves.png"), dpi=150)
plt.show()
print("Training curves saved at:", os.path.join(BASE_DIR, "training_curves.png"))

print("\nModel saved at:", MODEL_PATH)