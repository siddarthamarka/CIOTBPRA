# 🫀 CIOT-BPRA — Cloud-Integrated IoT Blood Pressure Risk Analysis System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![ESP32](https://img.shields.io/badge/ESP32-IoT-E7352C?style=for-the-badge&logo=espressif&logoColor=white)

**A full-stack IoT system for real-time blood pressure monitoring with deep learning-based risk classification, live dashboard, and automated email alerts.**

[Features](#-features) · [Architecture](#-system-architecture--workflow) · [Installation](#-installation-guide) · [API Docs](#-api-endpoints) · [Screenshots](#-screenshots--output) · [Future Work](#-future-enhancements)

</div>

---

## 📌 Project Description

**CIOT-BPRA** (Cloud-Integrated IoT Blood Pressure Risk Analysis) is a production-grade, end-to-end IoT healthcare monitoring system that acquires blood pressure (SBP, DBP) and heart rate (HR) data from a wrist-type sensor via an ESP32-S microcontroller, transmits it wirelessly to a FastAPI backend, classifies the health risk using a trained deep learning model (**SPMR Model**), stores records in MongoDB Atlas, visualizes them on a live React.js dashboard, and dispatches automated HTML email alerts for critical conditions.

The system classifies vitals into four risk levels:

| Risk Level | Description |
|---|---|
| ✅ **Normal** | All vitals within healthy AHA-defined ranges |
| ⚠️ **Alert** | Mildly elevated readings requiring attention |
| 🟠 **Warning** | Stage 1/2 hypertension or abnormal HR — consult doctor |
| 🚨 **Emergency** | Life-threatening values — immediate hospitalization |

> Built as a B.E. final year project in Electronics & Communication Engineering. Suitable for real-world deployment in home care, elderly monitoring, and remote patient management.

---

## ✨ Features

- 🔌 **IoT Hardware Integration** — ESP32-S reads BP sensor via UART, transmits JSON over WiFi
- 🧠 **Deep Learning Classification** — SPMR neural network (99% F1-score) classifies 4 risk levels
- 📊 **Live React Dashboard** — Auto-refreshes every 5 seconds with charts, metrics, and alerts
- 📈 **Trend & Analytics Pages** — Area charts, bar charts, day/week/month aggregations
- 📋 **Full History View** — Filterable table with risk-based filter and CSV export
- 📧 **Automated Email Alerts** — Styled HTML email with BP cards, recommendations, embedded logo
- 🔐 **JWT Authentication** — Secure register/login with BCrypt password hashing
- ☁️ **MongoDB Atlas** — TLS-secured cloud database with scalable document storage
- 📱 **Responsive UI** — Works on desktop and mobile browsers

---

## 🛠️ Technologies Used

### Hardware
| Component | Purpose |
|---|---|
| ESP32-S Microcontroller | WiFi-enabled MCU for sensor interfacing and HTTP transmission |
| Wrist BP Sensor Module | Oscillometric SBP/DBP/HR measurement via 5-pin JST-SH UART |
| Arduino IDE 2.3.5 | Firmware development and upload |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.10+ | Core runtime |
| FastAPI | High-performance RESTful API framework |
| TensorFlow / Keras | Deep learning model (SPMR) training and inference |
| PyMongo | MongoDB Atlas driver |
| PassLib (BCrypt) | Secure password hashing |
| Python-Jose | JWT token generation and validation |
| Pytz | IST timezone-aware timestamps |
| smtplib | Email alert dispatch via Gmail SMTP |

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | Component-based SPA dashboard |
| Recharts | AreaChart, LineChart, BarChart, PieChart |
| Axios | HTTP client with auto token injection |
| React Router v6 | Client-side routing and auth guards |
| date-fns | Date formatting |

### Database & Cloud
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted NoSQL database |
| certifi | TLS CA bundle for secure MongoDB connection |

### ML Pipeline
| Technology | Purpose |
|---|---|
| Google Colab | GPU-accelerated model training |
| Pandas / NumPy | Data preprocessing |
| Scikit-learn | Train/test split, StandardScaler, classification report |
| Matplotlib / Seaborn | Training curves and confusion matrix visualization |

---

## 🏗️ System Architecture / Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CIOT-BPRA System Flow                            │
└─────────────────────────────────────────────────────────────────────────┘

  [BP Sensor Module]
        │  UART (115200 baud)
        ▼
  [ESP32-S MCU]  ──── WiFi HTTP POST ────►  [FastAPI Backend]
                                                    │
                              ┌─────────────────────┼──────────────────────┐
                              ▼                     ▼                      ▼
                     [SPMR DL Model]       [MongoDB Atlas]        [Email Service]
                     Risk Classification    Store Record          HTML Alert Email
                     Normal/Alert/          (SBP, DBP, HR,        (if non-Normal)
                     Warning/Emergency      risk, timestamp)
                                                    │
                                                    ▼
                                          [React.js Frontend]
                                          Live Dashboard (5s refresh)
                                          Trends | Analytics | History
```

**Data Flow:**
1. Patient triggers BP measurement on the sensor
2. Sensor outputs `success,{SBP},{DBP},{HR}` via UART to ESP32
3. ESP32 POSTs JSON `{"sbp": X, "dbp": Y, "hr": Z}` to `/predict?token=...`
4. FastAPI validates input → runs SPMR model inference → saves to MongoDB
5. If risk is Alert/Warning/Emergency → dispatches HTML email to patient
6. React dashboard polls `/records` every 5s → renders live charts & metrics

---

## 📁 Project Directory Structure

```
ciotbpra/
│
├── backend/                          # Python FastAPI backend
│   ├── config/
│   │   └── settings.py               # Centralized env/config loader
│   ├── routes/
│   │   └── api.py                    # All API endpoint definitions
│   ├── services/
│   │   ├── auth_service.py           # BCrypt hashing + JWT logic
│   │   ├── email_service.py          # HTML email builder + SMTP sender
│   │   └── ml_service.py             # SPMR model loader + predict_bp()
│   ├── db/
│   │   └── database.py               # MongoDB Atlas connection
│   ├── models/
│   │   └── schemas.py                # Pydantic request/response models
│   ├── utils/
│   │   └── helpers.py                # get_recommendation() utility
│   ├── assets/
│   │   └── CIOTBPRALogo.png          # Inline logo for email alerts
│   ├── SPMR_Model.h5                 # Trained deep learning model
│   ├── main.py                       # FastAPI app entry point + CORS
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # Environment variables (not committed)
│
├── frontend/                         # React.js frontend dashboard
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/               # Recommendation images (diet, exercise, etc.)
│   │   ├── components/
│   │   │   ├── Sidebar.js            # Navigation sidebar with logo
│   │   │   ├── Topbar.js             # Live indicator + refresh button
│   │   │   ├── DashboardLayout.js    # Sidebar + main layout wrapper
│   │   │   ├── MetricCard.js         # Animated vital signs card
│   │   │   ├── RiskBadge.js          # Pulsing color-coded risk label
│   │   │   └── AlertBanner.js        # Risk status + recommendation strip
│   │   ├── context/
│   │   │   └── AuthContext.js        # Global auth state (token, login, logout)
│   │   ├── hooks/
│   │   │   └── useBPData.js          # Auto-refresh hook + CSV download
│   │   ├── pages/
│   │   │   ├── LoginPage.js          # JWT login form
│   │   │   ├── RegisterPage.js       # New account registration
│   │   │   ├── OverviewPage.js       # Dashboard home: metrics + recommendations
│   │   │   ├── TrendsPage.js         # BP area chart + HR line chart
│   │   │   ├── AnalyticsPage.js      # Bar chart + pie chart + aggregation tables
│   │   │   └── HistoryPage.js        # Full record table with risk filter + search
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance + interceptors
│   │   │   └── helpers.js            # getRiskConfig, getRecommendation, aggregation
│   │   ├── styles/
│   │   │   └── global.css            # Complete design system CSS
│   │   ├── App.js                    # Route definitions + auth guards
│   │   └── index.js                  # React DOM entry point
│   ├── .env                          # REACT_APP_API_URL
│   └── package.json
│
├── ml_pipeline/                      # Standalone ML training scripts
│   ├── preprocess.py                 # Label dataset using classify_vitals()
│   └── train_model.py                # SPMR model training + evaluation
│
├── esp32_firmware/
│   └── BP.ino                        # Arduino C++ firmware for ESP32-S
│
└── README.md
```

---

## ⚙️ Installation Guide

### Prerequisites

Make sure the following are installed on your system:

| Requirement | Version | Download |
|---|---|---|
| Python | 3.10+ | [python.org](https://www.python.org/downloads/) |
| Node.js + npm | 18+ | [nodejs.org](https://nodejs.org/) |
| Arduino IDE | 2.3.5 | [arduino.cc](https://www.arduino.cc/en/software) |
| MongoDB Atlas Account | Free tier | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| Gmail Account | App Password enabled | [myaccount.google.com](https://myaccount.google.com/apppasswords) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ciotbpra.git
cd ciotbpra
```

---

### 2. Backend Setup

```bash
cd backend
```

**Install Python dependencies:**

```bash
pip install -r requirements.txt
```

**Create your `.env` file:**

```bash
# backend/.env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bpdb?retryWrites=true&w=majority&authSource=admin
SECRET_KEY=your_super_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> ⚠️ **Never commit `.env` to GitHub.** It is already listed in `.gitignore`.

> 📌 To generate a strong `SECRET_KEY`:
> ```bash
> python -c "import secrets; print(secrets.token_hex(32))"
> ```

**Run the backend server:**

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Verify it's running:**

Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser.
You should see the FastAPI **Swagger UI** with all endpoints listed.

---

### 3. Frontend Setup

Open a **new terminal window:**

```bash
cd frontend
```

**Install Node dependencies:**

```bash
npm install
```

**Create your `.env` file:**

```bash
# frontend/.env
REACT_APP_API_URL=http://127.0.0.1:8000
```

**Start the frontend development server:**

```bash
npm start
```

The dashboard opens automatically at [http://localhost:3000](http://localhost:3000)

---

### 4. ESP32 Firmware Setup

1. Open **Arduino IDE 2.3.5**
2. Go to `Tools → Board → ESP32 Arduino → ESP32 Dev Module`
3. Open `esp32_firmware/BP.ino`
4. Update these values at the top of the file:

```cpp
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* token    = "YOUR_JWT_TOKEN_FROM_LOGIN";
const char* serverURL = "http://YOUR_PC_IP:8000/predict";
```

> 📌 Find your PC's local IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

5. Select the correct COM port: `Tools → Port → COMx`
6. Click **Upload** (→ button)
7. Open **Serial Monitor** at 115200 baud to monitor live output

---

### 5. Running Both Servers (Quick Reference)

| Terminal | Command | URL |
|---|---|---|
| Terminal 1 (Backend) | `cd backend && python -m uvicorn main:app --reload` | http://127.0.0.1:8000 |
| Terminal 2 (Frontend) | `cd frontend && npm start` | http://localhost:3000 |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| `SECRET_KEY` | JWT signing secret (min 32 chars) | `a3f7e2b1c...` |
| `EMAIL_USER` | Gmail address for sending alerts | `yourapp@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (not your login password) | `xxxx xxxx xxxx xxxx` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend server base URL | `http://127.0.0.1:8000` |

---

## 📡 API Endpoints

All endpoints are documented interactively at `http://127.0.0.1:8000/docs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new patient account |
| `POST` | `/login` | ❌ | Login and receive JWT access token |
| `POST` | `/predict?token=` | ✅ | Submit BP/HR data → classify → store → alert |
| `GET` | `/records?token=` | ✅ | Retrieve all historical records for the user |
| `GET` | `/download?token=` | ✅ | Download all records as CSV file |

### Sample Request — `/predict`

```json
POST /predict?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "sbp": 145,
  "dbp": 95,
  "hr": 110
}
```

### Sample Response

```json
{
  "risk": "Warning"
}
```

---

## 🧠 SPMR Model — Architecture & Performance

**Model:** Feedforward Neural Network (Multi-layer Perceptron)  
**Input:** `[SBP, DBP, HR]` (StandardScaler normalized)  
**Output:** 4-class Softmax — `[Normal, Alert, Warning, Emergency]`

```
Input(3) → Dense(128, ReLU) → BatchNorm → Dropout(0.3)
         → Dense(64, ReLU)  → BatchNorm → Dropout(0.2)
         → Dense(32, ReLU)
         → Dense(4, Softmax)
```

**Training:** 100 epochs max, EarlyStopping (patience=8), Adam optimizer, Categorical Cross-Entropy loss

### Confusion Matrix Results (Test Set: 9,144 samples)

| True \ Predicted | Normal | Alert | Warning | Emergency |
|---|---|---|---|---|
| **Normal** | **1006** | 13 | 0 | 0 |
| **Alert** | 5 | **1484** | 28 | 0 |
| **Warning** | 17 | 8 | **6217** | 14 |
| **Emergency** | 0 | 0 | 4 | **348** |

### Performance Metrics

| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| Normal | 97.8% | 98.7% | 98.2% |
| Alert | 98.6% | 97.7% | 98.1% |
| Warning | 99.3% | 99.4% | 99.4% |
| Emergency | 96.1% | 98.9% | 97.5% |
| **Weighted Avg** | **98.8%** | **99.1%** | **99.0%** |

> ✅ Zero cross-misclassification between **Normal** and **Emergency** — clinically critical result.

---

## 📸 Screenshots / Output

### 🖥️ Dashboard — Overview Page
![Overview](docs/screenshots/overview.png)
> Live vitals (SBP, DBP, HR, Risk), health recommendation images, and recent readings table.

### 📈 Trends — Blood Pressure
![BP Trends](docs/screenshots/bp_trends.png)
> Area chart showing SBP and DBP over time across all monitoring sessions.

### ❤️ Trends — Heart Rate
![HR Trends](docs/screenshots/hr_trends.png)
> Line chart with dot markers showing HR variability over time.

### 📊 Analytics Page
![Analytics](docs/screenshots/analytics.png)
> Day-wise average bar charts + tabular aggregations for SBP, DBP, HR.

### 📧 Email Alert (Gmail)
![Email Alert](docs/screenshots/email_service.png)
> Automated HTML email with risk banner, BP reading cards, and recommendation.

### 🔬 Confusion Matrix
![Confusion Matrix](docs/screenshots/confusion_matrix.png)
> SPMR model classification results on 9,144 test samples.

### 🔧 Arduino Serial Monitor
![Arduino Output](docs/screenshots/arduino_op.png)
> ESP32 live output showing sensor data reception, HTTP POST, and server response.

### ⚡ Circuit Diagram
![Circuit Diagram](docs/screenshots/circuit_diagram.png)
> ESP32-S to BP Sensor Module wiring with UART and power connections.

> 📌 **To add screenshots:** Create a `docs/screenshots/` folder and place the images there.

---

## 🩺 Risk Classification Logic (AHA-Based)

```python
def classify_vitals(sbp, dbp, hr):
    # 1. Emergency — life-threatening (highest priority)
    if sbp >= 180 or dbp >= 120 or sbp < 70 or dbp < 40 or hr > 150 or hr < 40:
        return "Emergency"

    # 2. Normal — AHA healthy ranges
    if (90 <= sbp <= 129) and (60 <= dbp <= 84) and (60 <= hr <= 99):
        return "Normal"

    # 3. Warning — Stage 1/2 hypertension or bradycardia risk
    if (140 <= sbp < 180) or (90 <= dbp < 120) or (70 <= sbp < 90) or \
       (40 <= dbp < 60) or (110 <= hr <= 150):
        return "Warning"

    # 4. Alert — mildly elevated
    if (130 <= sbp < 140) or (85 <= dbp < 90) or \
       (100 <= hr < 110) or (50 <= hr < 60):
        return "Alert"

    return "Normal"   # fallback
```

---

## 🚀 Future Enhancements

- [ ] 📱 **Mobile App** — React Native iOS/Android app with push notifications
- [ ] 📡 **Continuous PPG Monitoring** — Replace episodic oscillometric with wearable continuous sensing
- [ ] 🏥 **Multi-Patient Dashboard** — Role-based caregiver view for monitoring multiple patients
- [ ] 🔗 **EHR Integration** — HL7 FHIR API for sharing data with hospital systems
- [ ] 🔮 **Predictive Analytics** — LSTM-based forecasting for hypertensive crisis prediction
- [ ] 🐳 **Docker + Cloud Deployment** — Containerized backend on AWS/Azure/GCP with CI/CD
- [ ] 🔒 **Federated Learning** — Privacy-preserving distributed model training across devices
- [ ] 🌡️ **Multi-Parameter Sensing** — Add SpO2, temperature, ECG, respiratory rate

---

## 👨‍💻 Contributors

| Name | Role |
|---|---|
| **Siddarth Marka** | Full-Stack Developer, ML Engineer, IoT Hardware Designer |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — Free to use, modify, and distribute with attribution.
```

---

## 🙏 Acknowledgements

- [American Heart Association](https://www.heart.org) — Blood pressure classification guidelines
- [FastAPI](https://fastapi.tiangolo.com) — Backend framework
- [TensorFlow / Keras](https://www.tensorflow.org) — Deep learning framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Recharts](https://recharts.org) — React charting library
- [Espressif Systems](https://www.espressif.com) — ESP32 documentation

---

<div align="center">

**Built with ❤️ for smarter, accessible healthcare monitoring.**

⭐ Star this repo if you find it useful!

</div>
