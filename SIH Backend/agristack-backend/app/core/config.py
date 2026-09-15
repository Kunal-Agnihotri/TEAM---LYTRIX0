from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017/agristack"
    db_name: str = "agristack"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    elevenlabs_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
