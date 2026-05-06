import pandas as pd
import os

BASE_DIR = os.getcwd()
INPUT_FILE = "/content/Patient_BP_from_ABP.xlsx"

if not os.path.exists(INPUT_FILE):
    raise FileNotFoundError(f"Input file not found: {INPUT_FILE}")

df = pd.read_excel(INPUT_FILE)

# Validate required columns
REQUIRED_COLS = {"SBP", "DBP", "HR"}
if not REQUIRED_COLS.issubset(df.columns):
    raise ValueError(f"Excel file must contain columns: {REQUIRED_COLS}. Found: {list(df.columns)}")


# Label function — fixed name used consistently
def classify_vitals(sbp, dbp, hr):

    # 1. NORMAL (highest priority)
    if (90 <= sbp <= 120) and (60 <= dbp <= 80) and (60 <= hr <= 100):
        return "Normal"

    # 2. EMERGENCY
    if (
        sbp >= 180 or dbp >= 120 or
        sbp < 70  or dbp < 40  or
        hr > 150
    ):
        return "Emergency"

    # 3. WARNING
    if (
        (140 <= sbp < 180) or
        (90  <= dbp < 120) or
        (70  <= sbp < 90)  or
        (40  <= dbp < 60)  or
        (110 <= hr  <= 150)
    ):
        return "Warning"

    # 4. ALERT
    if (
        (121 <= sbp < 140) or
        (81  <= dbp < 90)  or
        (101 <= hr  < 110) or
        (50  <= hr  < 60)
    ):
        return "Alert"

    # Fallback
    return "Alert"


# Apply labeling — function name matches definition
df["bp_label"] = df.apply(
    lambda row: classify_vitals(row["SBP"], row["DBP"], row["HR"]),
    axis=1
)

# Save output
OUTPUT_FILE = os.path.join(BASE_DIR, "processed_bp_snapshot.csv")
df.to_csv(OUTPUT_FILE, index=False)

print(df["bp_label"].value_counts())
print("\nPreprocessing done")
print("Saved at:", OUTPUT_FILE)