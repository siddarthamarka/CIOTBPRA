import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SECRET_KEY:  str = os.getenv("SECRET_KEY", "changeme")
    ALGORITHM:   str = "HS256"
    TOKEN_HOURS: int = 10

    MONGO_URL:   str = os.getenv("MONGO_URL", "")
    DB_NAME:     str = "bpdb"

    EMAIL_USER:  str = os.getenv("EMAIL_USER", "")
    EMAIL_PASS:  str = os.getenv("EMAIL_PASS", "")
    SMTP_HOST:   str = "smtp.gmail.com"
    SMTP_PORT:   int = 587

    BASE_DIR:    str = os.path.dirname(os.path.abspath(__file__ + "/.."))

settings = Settings()