from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from jose import JWTError
from datetime import datetime
import csv
from io import StringIO
import pytz

from models.schemas import Register, Login, BPData
from db.database import users_collection, bp_collection
from services.auth_service import hash_password, verify_password, create_token, decode_token
from services.ml_service import predict_bp
from services.email_service import send_email_alert

router = APIRouter()


# ── Auth helper ───────────────────────────────────────────
def get_user_email(token: str) -> str:
    try:
        return decode_token(token)["email"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ── Register ──────────────────────────────────────────────
@router.post("/register")
def register(user: Register):
    try:
        if users_collection.find_one({"email": user.email}):
            return {"message": "User already exists"}

        users_collection.insert_one({
            "name": user.name,
            "age": user.age,
            "gender": user.gender,
            "email": user.email,
            "password": hash_password(user.password)
        })

        return {"message": "registered"}

    except Exception as e:
        print(f"REGISTER ERROR: {e}")
        return {"error": str(e)}


# ── Login ─────────────────────────────────────────────────
@router.post("/login")
def login(user: Login):
    try:
        db_user = users_collection.find_one({"email": user.email})

        if not db_user:
            return {"error": "User not found"}

        if not verify_password(user.password, db_user["password"]):
            return {"error": "Invalid password"}

        return {"access_token": create_token({"email": user.email})}

    except Exception as e:
        print(f"LOGIN ERROR: {e}")
        return {"error": str(e)}


# ── Predict ───────────────────────────────────────────────
@router.post("/predict")
def predict(data: BPData, token: str):
    try:
        # 🔐 Authenticate user
        email = get_user_email(token)
        db_user = users_collection.find_one({"email": email})

        if not db_user:
            return {"error": "User not found"}

        name = db_user.get("name", "User")
        age = db_user.get("age", "N/A")
        gender = db_user.get("gender", "N/A")

        # ================= STEP 1: ML PREDICTION =================
        risk = predict_bp(data.sbp, data.dbp, data.hr)
        risk = risk.strip().capitalize()

        # ================= STEP 2: RULE-BASED VALIDATION =================
        def rule_based_check(sbp, dbp, hr):
            if (90 <= sbp <= 120) and (60 <= dbp <= 80) and (60 <= hr <= 100):
                return "Normal"
            return None

        rule_result = rule_based_check(data.sbp, data.dbp, data.hr)

        # ================= STEP 3: OVERRIDE =================
        if rule_result == "Normal":
            risk = "Normal"

        # ================= STEP 4: STORE DATA =================
        ist = pytz.timezone("Asia/Kolkata")
        current_time = datetime.now(ist)

        bp_collection.insert_one({
            "email": email,
            "sbp": data.sbp,
            "dbp": data.dbp,
            "hr": data.hr,
            "prediction": risk,
            "timestamp": current_time
        })

        print(f"✅ Stored prediction: {risk}")

        # ================= STEP 5: EMAIL ALERT =================
        if risk in ["Alert", "Warning", "Emergency"]:
            print("📧 Sending email alert...")
            send_email_alert(
                email, name, age, gender,
                data.sbp, data.dbp, data.hr, risk
            )

        return {"risk": risk}

    except Exception as e:
        print(f"PREDICT ERROR: {e}")
        return {"error": str(e)}


# ── Records ───────────────────────────────────────────────
@router.get("/records")
def records(token: str):
    try:
        email = get_user_email(token)
        data = list(bp_collection.find({"email": email}, {"_id": 0}))
        return data

    except Exception as e:
        print(f"RECORD ERROR: {e}")
        return {"error": str(e)}


# ── Download ──────────────────────────────────────────────
@router.get("/download")
def download(token: str):
    try:
        email = get_user_email(token)
        data = list(bp_collection.find({"email": email}, {"_id": 0}))

        if not data:
            return {"message": "No data found"}

        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=bp_data.csv"}
        )

    except Exception as e:
        print(f"DOWNLOAD ERROR: {e}")
        return {"error": str(e)}