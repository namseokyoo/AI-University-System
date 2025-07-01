"""
API 라우터 설정
모든 엔드포인트를 중앙 집중식으로 관리
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

# 라우터 인스턴스 생성
api_router = APIRouter()

# 임시 엔드포인트들 (Phase 1.1 기본 구조)


@api_router.get("/")
async def api_root():
    """API 루트 엔드포인트"""
    return {
        "message": "AI University System API",
        "version": "v1",
        "status": "active",
        "endpoints": {
            "auth": "/auth",
            "users": "/users",
            "courses": "/courses",
            "content": "/content",
            "ai": "/ai",
            "analytics": "/analytics"
        }
    }


@api_router.get("/status")
async def api_status():
    """API 상태 확인"""
    return {
        "api_version": "v1",
        "status": "healthy",
        "services": {
            "database": "connected",  # 추후 실제 검사
            "cache": "connected",     # 추후 실제 검사
            "ai_service": "available"  # 추후 실제 검사
        }
    }

# 향후 추가될 라우터들 (Phase 2부터)
# from .auth import auth_router
# from .users import users_router
# from .courses import courses_router
# from .content import content_router
# from .ai import ai_router
# from .analytics import analytics_router

# 라우터 포함 (Phase 2부터 활성화)
# api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
# api_router.include_router(users_router, prefix="/users", tags=["users"])
# api_router.include_router(courses_router, prefix="/courses", tags=["courses"])
# api_router.include_router(content_router, prefix="/content", tags=["content"])
# api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
# api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
