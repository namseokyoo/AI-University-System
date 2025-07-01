"""
애플리케이션 설정 관리
환경 변수 기반 설정 시스템
"""
from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """애플리케이션 설정 클래스"""

    # 기본 애플리케이션 설정
    APP_NAME: str = "AI University System"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # 서버 설정
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS 설정
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # Next.js 개발 서버
        "http://localhost:3001",
        "https://localhost:3000",
        "https://ai-university.vercel.app",  # 프로덕션 도메인 (추후)
    ]

    ALLOWED_HOSTS: List[str] = ["*"]

    # 데이터베이스 설정 (Supabase)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_SERVICE_KEY: Optional[str] = None

    # AI API 설정
    DEEPSEEK_API_KEY: Optional[str] = None
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"

    # YouTube API 설정
    YOUTUBE_API_KEY: Optional[str] = None

    # Redis 설정 (캐싱)
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PASSWORD: Optional[str] = None

    # JWT 설정
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # 파일 업로드 설정
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB

    # 로깅 설정
    LOG_LEVEL: str = "INFO"

    # GitHub 콘텐츠 설정
    GITHUB_TOKEN: Optional[str] = None
    CONTENT_REPO: str = "your-username/ai-university-content"
    CONTENT_BRANCH: str = "main"

    # Cloudflare R2 설정 (추후)
    R2_ACCOUNT_ID: Optional[str] = None
    R2_ACCESS_KEY: Optional[str] = None
    R2_SECRET_KEY: Optional[str] = None
    R2_BUCKET_NAME: str = "ai-university-media"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False  # 대소문자 구분 해제


# 전역 설정 인스턴스
settings = Settings()

# 개발 환경 설정 검증


def validate_development_settings():
    """개발 환경에서 필요한 설정들 검증"""
    if settings.ENVIRONMENT == "development":
        print("🔧 Development environment detected")
        if not settings.SUPABASE_URL:
            print("⚠️  Warning: SUPABASE_URL not set")
        if not settings.DEEPSEEK_API_KEY:
            print("⚠️  Warning: DEEPSEEK_API_KEY not set")
        return True
    return True

# 프로덕션 환경 설정 검증


def validate_production_settings():
    """프로덕션 환경에서 필수 설정들 검증"""
    if settings.ENVIRONMENT == "production":
        required_settings = [
            "SUPABASE_URL",
            "SUPABASE_KEY",
            "DEEPSEEK_API_KEY",
            "SECRET_KEY"
        ]

        missing_settings = []
        for setting in required_settings:
            if not getattr(settings, setting):
                missing_settings.append(setting)

        if missing_settings:
            raise ValueError(
                f"Missing required production settings: {missing_settings}")

    return True
