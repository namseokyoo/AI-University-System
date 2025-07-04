"""
API 라우터 설정
모든 엔드포인트를 중앙 집중식으로 관리
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from datetime import datetime

# 인증 라우터 임포트
from .auth import router as auth_router
# 코스 라우터 임포트
from .courses import router as courses_router
# 수강신청 라우터 임포트
from .enrollments import router as enrollments_router

# 라우터 인스턴스 생성
api_router = APIRouter()

# 라우터 포함
api_router.include_router(auth_router)
api_router.include_router(courses_router)
api_router.include_router(enrollments_router)

# Request/Response 모델들


class CourseGenerationRequest(BaseModel):
    topic: str
    skill_level: str = "beginner"
    duration_hours: int = 10
    learning_goals: List[str]


class VideoSearchRequest(BaseModel):
    query: str
    max_results: int = 10
    skill_level: str = "beginner"


class AIEvaluationRequest(BaseModel):
    question: str
    user_answer: str
    expected_answer: str
    context: str = ""

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
    from ..core.config import settings
    from supabase import create_client
    import os

    # Supabase 연결 상태 확인
    database_status = "not_connected"
    try:
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        if url and key:
            supabase = create_client(url, key)
            # 간단한 쿼리로 연결 테스트
            result = supabase.table("users").select(
                "count", count="exact").limit(0).execute()
            database_status = "connected"
    except Exception:
        database_status = "error"

    return {
        "api_version": "v1",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": database_status,
            "auth": "configured" if database_status == "connected" else "not_configured",
            "cache": "not_implemented",
            "ai_service": "configured" if settings.DEEPSEEK_API_KEY else "not_configured",
            "youtube_service": "configured" if settings.YOUTUBE_API_KEY else "not_configured"
        },
        "endpoints": {
            "auth": {
                "signup": "/auth/signup",
                "signin": "/auth/signin",
                "signout": "/auth/signout",
                "me": "/auth/me",
                "verify_token": "/auth/verify-token",
                "refresh": "/auth/refresh"
            },
            "ai": {
                "generate_course": "/ai/generate-course",
                "evaluate": "/ai/evaluate"
            },
            "youtube": {
                "search": "/youtube/search",
                "recommend": "/youtube/recommend/{topic}"
            }
        }
    }

# AI 관련 엔드포인트 (Phase 1.2)


@api_router.post("/ai/generate-course")
async def generate_course_outline(request: CourseGenerationRequest) -> Dict[str, Any]:
    """AI 기반 코스 개요 생성"""
    from ..services.ai_service import ai_service

    try:
        async with ai_service:
            result = await ai_service.generate_course_outline(
                topic=request.topic,
                skill_level=request.skill_level,
                duration_hours=request.duration_hours,
                learning_goals=request.learning_goals
            )

        if result:
            return {
                "success": True,
                "data": result,
                "message": "Course outline generated successfully"
            }
        else:
            raise HTTPException(
                status_code=503,
                detail="AI service unavailable or failed to generate course outline"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/ai/evaluate")
async def evaluate_answer(request: AIEvaluationRequest) -> Dict[str, Any]:
    """AI 기반 답변 평가"""
    from ..services.ai_service import ai_service

    try:
        async with ai_service:
            evaluation = await ai_service.evaluate_user_response(
                question=request.question,
                user_answer=request.user_answer,
                expected_answer=request.expected_answer,
                context=request.context
            )

        if evaluation:
            return {
                "success": True,
                "data": evaluation,
                "message": "Answer evaluated successfully"
            }
        else:
            raise HTTPException(
                status_code=503,
                detail="AI service unavailable or failed to evaluate answer"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# YouTube 관련 엔드포인트 (Phase 1.2)
@api_router.post("/youtube/search")
async def search_educational_videos(request: VideoSearchRequest) -> Dict[str, Any]:
    """교육용 비디오 검색"""
    from ..services.youtube_service import youtube_service

    try:
        async with youtube_service:
            videos = await youtube_service.search_educational_videos(
                query=request.query,
                max_results=request.max_results
            )

        if videos is not None:
            return {
                "success": True,
                "data": videos,
                "count": len(videos),
                "message": "Videos found successfully"
            }
        else:
            raise HTTPException(
                status_code=503,
                detail="YouTube service unavailable"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/youtube/recommend/{topic}")
async def recommend_videos(
    topic: str,
    skill_level: str = Query("beginner", description="기술 수준"),
    max_results: int = Query(5, description="최대 결과 수")
) -> Dict[str, Any]:
    """주제와 기술 수준에 맞는 비디오 추천"""
    from ..services.youtube_service import youtube_service

    try:
        async with youtube_service:
            videos = await youtube_service.recommend_videos_for_topic(
                topic=topic,
                skill_level=skill_level,
                max_results=max_results
            )

        if videos is not None:
            return {
                "success": True,
                "data": videos,
                "count": len(videos),
                "topic": topic,
                "skill_level": skill_level,
                "message": "Video recommendations generated successfully"
            }
        else:
            raise HTTPException(
                status_code=503,
                detail="YouTube service unavailable"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 향후 추가될 라우터들 (Phase 2부터)
# from .auth import auth_router
# from .users import users_router
# from .courses import courses_router
# from .content import content_router
# from .analytics import analytics_router

# 라우터 포함 (Phase 2부터 활성화)
# api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
# api_router.include_router(users_router, prefix="/users", tags=["users"])
# api_router.include_router(courses_router, prefix="/courses", tags=["courses"])
# api_router.include_router(content_router, prefix="/content", tags=["content"])
# api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
