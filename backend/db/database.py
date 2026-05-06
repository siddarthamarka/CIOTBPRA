import certifi
from pymongo import MongoClient
from config.settings import settings

client = MongoClient(
    settings.MONGO_URL,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=5000
)

db               = client[settings.DB_NAME]
users_collection = db["users"]
bp_collection    = db["bpdata"]