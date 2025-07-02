"""
코스 관리 API 엔드포인트
코스 생성, 조회, AI 기반 코스 생성
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from ..services.course_service import CourseService
from ..services.ai_service import AIService
from ..core.database import get_db
from ..api.auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/courses", tags=["courses"])


# Pydantic 모델들
class CourseCreateRequest(BaseModel):
    """코스 생성 요청"""
    title: str = Field(..., min_length=1, max_length=200, description="코스 제목")
    description: str = Field(..., min_length=10, description="코스 설명")
    difficulty_level: str = Field(
        "beginner", description="난이도", pattern="^(beginner|intermediate|advanced|expert)$")
    estimated_duration_hours: Optional[int] = Field(
        None, ge=1, le=200, description="예상 학습 시간 (시간)")
    learning_objectives: Optional[List[str]] = Field(
        default_factory=list, description="학습 목표")
    target_audience: Optional[List[str]] = Field(
        default_factory=list, description="대상 학습자")
    tags: Optional[List[str]] = Field(default_factory=list, description="태그")
    categories: Optional[List[str]] = Field(
        default_factory=list, description="카테고리")


class AICourseCreateRequest(BaseModel):
    """AI 코스 생성 요청"""
    topic: str = Field(..., min_length=2, max_length=100, description="코스 주제")
    difficulty_level: str = Field(
        "beginner", description="난이도", pattern="^(beginner|intermediate|advanced|expert)$")
    target_hours: int = Field(..., ge=1, le=200, description="목표 학습 시간 (시간)")
    additional_requirements: Optional[str] = Field(
        None, max_length=1000, description="추가 요구사항")


class CourseResponse(BaseModel):
    """코스 응답 모델"""
    id: str
    title: str
    slug: str
    description: Optional[str]
    short_description: Optional[str]
    status: str
    difficulty_level: str
    estimated_duration_hours: Optional[int]
    learning_objectives: List[str]
    target_audience: List[str]
    tags: List[str]
    categories: List[str]
    instructor_id: Optional[str]
    rating: float
    enrolled_count: int
    is_ai_generated: bool
    is_free: bool
    price: float
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class CourseSummaryResponse(BaseModel):
    """코스 요약 응답 모델"""
    id: str
    title: str
    slug: str
    short_description: Optional[str]
    thumbnail_url: Optional[str]
    difficulty_level: str
    estimated_duration_hours: Optional[int]
    rating: float
    enrolled_count: int
    is_free: bool
    price: float
    tags: List[str]
    created_at: str

    class Config:
        from_attributes = True


# 의존성
def get_course_service(db: Session = Depends(get_db)) -> CourseService:
    """코스 서비스 의존성"""
    ai_service = AIService()
    return CourseService(db, ai_service)


# API 엔드포인트들
@router.post("/", response_model=CourseResponse, status_code=201)
async def create_course(
    course_data: CourseCreateRequest,
    current_user: User = Depends(get_current_user),
    course_service: CourseService = Depends(get_course_service)
):
    """
    새로운 코스를 생성합니다.

    - **title**: 코스 제목 (필수)
    - **description**: 코스 설명 (필수)
    - **difficulty_level**: 난이도 (beginner, intermediate, advanced, expert)
    - **estimated_duration_hours**: 예상 학습 시간
    - **learning_objectives**: 학습 목표 목록
    - **target_audience**: 대상 학습자 목록
    - **tags**: 태그 목록
    - **categories**: 카테고리 목록
    """
    try:
        course = course_service.create_course(
            title=course_data.title,
            description=course_data.description,
            instructor_id=current_user.id,
            difficulty_level=course_data.difficulty_level,
            estimated_duration_hours=course_data.estimated_duration_hours,
            learning_objectives=course_data.learning_objectives,
            target_audience=course_data.target_audience,
            tags=course_data.tags,
            categories=course_data.categories
        )

        return CourseResponse(
            id=course.id,
            title=course.title,
            slug=course.slug,
            description=course.description,
            short_description=course.short_description,
            status=course.status.value,
            difficulty_level=course.difficulty_level.value,
            estimated_duration_hours=course.estimated_duration_hours,
            learning_objectives=course.learning_objectives,
            target_audience=course.target_audience,
            tags=course.tags,
            categories=course.categories,
            instructor_id=course.instructor_id,
            rating=course.rating,
            enrolled_count=course.enrolled_count,
            is_ai_generated=course.is_ai_generated,
            is_free=course.is_free,
            price=course.price,
            created_at=course.created_at.isoformat() if course.created_at else "",
            updated_at=course.updated_at.isoformat() if course.updated_at else ""
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"코스 생성 실패: {str(e)}")


@router.post("/ai-generate", response_model=CourseResponse, status_code=201)
async def create_ai_course(
    course_data: AICourseCreateRequest,
    current_user: User = Depends(get_current_user),
    course_service: CourseService = Depends(get_course_service)
):
    """
    AI를 사용하여 코스를 자동 생성합니다.

    - **topic**: 코스 주제 (필수)
    - **difficulty_level**: 난이도 (beginner, intermediate, advanced, expert)
    - **target_hours**: 목표 학습 시간 (시간)
    - **additional_requirements**: 추가 요구사항 (선택)

    AI가 주제와 조건에 맞는 완전한 코스 구조를 자동으로 생성합니다.
    """
    try:
        course = await course_service.create_ai_course(
            topic=course_data.topic,
            difficulty_level=course_data.difficulty_level,
            target_hours=course_data.target_hours,
            instructor_id=current_user.id,
            additional_requirements=course_data.additional_requirements
        )

        return CourseResponse(
            id=course.id,
            title=course.title,
            slug=course.slug,
            description=course.description,
            short_description=course.short_description,
            status=course.status.value,
            difficulty_level=course.difficulty_level.value,
            estimated_duration_hours=course.estimated_duration_hours,
            learning_objectives=course.learning_objectives,
            target_audience=course.target_audience,
            tags=course.tags,
            categories=course.categories,
            instructor_id=course.instructor_id,
            rating=course.rating,
            enrolled_count=course.enrolled_count,
            is_ai_generated=course.is_ai_generated,
            is_free=course.is_free,
            price=course.price,
            created_at=course.created_at.isoformat() if course.created_at else "",
            updated_at=course.updated_at.isoformat() if course.updated_at else ""
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"AI 코스 생성 실패: {str(e)}")


@router.get("/", response_model=List[CourseSummaryResponse])
async def get_courses(
    skip: int = Query(0, ge=0, description="건너뛸 개수"),
    limit: int = Query(20, ge=1, le=100, description="조회할 개수"),
    status: Optional[str] = Query(
        None, description="상태 필터 (draft, published, archived)"),
    difficulty_level: Optional[str] = Query(None, description="난이도 필터"),
    search: Optional[str] = Query(None, description="검색어"),
    tags: Optional[str] = Query(None, description="태그 필터 (쉼표로 구분)"),
    categories: Optional[str] = Query(None, description="카테고리 필터 (쉼표로 구분)"),
    course_service: CourseService = Depends(get_course_service)
):
    """
    코스 목록을 조회합니다.

    - **skip**: 건너뛸 개수 (페이징)
    - **limit**: 조회할 개수 (최대 100개)
    - **status**: 상태 필터 (draft, published, archived)
    - **difficulty_level**: 난이도 필터
    - **search**: 검색어 (제목, 설명에서 검색)
    - **tags**: 태그 필터 (쉼표로 구분)
    - **categories**: 카테고리 필터 (쉼표로 구분)
    """
    try:
        # 쉼표로 구분된 태그/카테고리를 리스트로 변환
        tag_list = tags.split(",") if tags else None
        category_list = categories.split(",") if categories else None

        courses = course_service.get_courses(
            skip=skip,
            limit=limit,
            status=status,
            difficulty_level=difficulty_level,
            tags=tag_list,
            categories=category_list,
            search=search
        )

        return [
            CourseSummaryResponse(
                id=course.id,
                title=course.title,
                slug=course.slug,
                short_description=course.short_description,
                thumbnail_url=course.thumbnail_url,
                difficulty_level=course.difficulty_level.value,
                estimated_duration_hours=course.estimated_duration_hours,
                rating=course.rating,
                enrolled_count=course.enrolled_count,
                is_free=course.is_free,
                price=course.price,
                tags=course.tags,
                created_at=course.created_at.isoformat() if course.created_at else ""
            )
            for course in courses
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"코스 조회 실패: {str(e)}")


@router.get("/published", response_model=List[CourseSummaryResponse])
async def get_published_courses(
    skip: int = Query(0, ge=0, description="건너뛸 개수"),
    limit: int = Query(20, ge=1, le=100, description="조회할 개수"),
    course_service: CourseService = Depends(get_course_service)
):
    """
    발행된 코스 목록을 조회합니다.

    인증 없이 누구나 조회할 수 있습니다.
    """
    try:
        courses = course_service.get_published_courses(skip=skip, limit=limit)

        return [
            CourseSummaryResponse(
                id=course.id,
                title=course.title,
                slug=course.slug,
                short_description=course.short_description,
                thumbnail_url=course.thumbnail_url,
                difficulty_level=course.difficulty_level.value,
                estimated_duration_hours=course.estimated_duration_hours,
                rating=course.rating,
                enrolled_count=course.enrolled_count,
                is_free=course.is_free,
                price=course.price,
                tags=course.tags,
                created_at=course.created_at.isoformat() if course.created_at else ""
            )
            for course in courses
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"발행된 코스 조회 실패: {str(e)}")


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: str,
    course_service: CourseService = Depends(get_course_service)
):
    """
    특정 코스의 상세 정보를 조회합니다.

    - **course_id**: 코스 ID
    """
    try:
        course = course_service.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="코스를 찾을 수 없습니다")

        return CourseResponse(
            id=course.id,
            title=course.title,
            slug=course.slug,
            description=course.description,
            short_description=course.short_description,
            status=course.status.value,
            difficulty_level=course.difficulty_level.value,
            estimated_duration_hours=course.estimated_duration_hours,
            learning_objectives=course.learning_objectives,
            target_audience=course.target_audience,
            tags=course.tags,
            categories=course.categories,
            instructor_id=course.instructor_id,
            rating=course.rating,
            enrolled_count=course.enrolled_count,
            is_ai_generated=course.is_ai_generated,
            is_free=course.is_free,
            price=course.price,
            created_at=course.created_at.isoformat() if course.created_at else "",
            updated_at=course.updated_at.isoformat() if course.updated_at else ""
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"코스 조회 실패: {str(e)}")


@router.get("/slug/{slug}", response_model=CourseResponse)
async def get_course_by_slug(
    slug: str,
    course_service: CourseService = Depends(get_course_service)
):
    """
    슬러그로 특정 코스의 상세 정보를 조회합니다.

    - **slug**: 코스 슬러그 (URL 친화적 식별자)
    """
    try:
        course = course_service.get_course_by_slug(slug)
        if not course:
            raise HTTPException(status_code=404, detail="코스를 찾을 수 없습니다")

        return CourseResponse(
            id=course.id,
            title=course.title,
            slug=course.slug,
            description=course.description,
            short_description=course.short_description,
            status=course.status.value,
            difficulty_level=course.difficulty_level.value,
            estimated_duration_hours=course.estimated_duration_hours,
            learning_objectives=course.learning_objectives,
            target_audience=course.target_audience,
            tags=course.tags,
            categories=course.categories,
            instructor_id=course.instructor_id,
            rating=course.rating,
            enrolled_count=course.enrolled_count,
            is_ai_generated=course.is_ai_generated,
            is_free=course.is_free,
            price=course.price,
            created_at=course.created_at.isoformat() if course.created_at else "",
            updated_at=course.updated_at.isoformat() if course.updated_at else ""
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"코스 조회 실패: {str(e)}")


@router.get("/instructor/{instructor_id}", response_model=List[CourseSummaryResponse])
async def get_instructor_courses(
    instructor_id: str,
    course_service: CourseService = Depends(get_course_service)
):
    """
    특정 강사의 코스 목록을 조회합니다.

    - **instructor_id**: 강사 ID
    """
    try:
        courses = course_service.get_instructor_courses(instructor_id)

        return [
            CourseSummaryResponse(
                id=course.id,
                title=course.title,
                slug=course.slug,
                short_description=course.short_description,
                thumbnail_url=course.thumbnail_url,
                difficulty_level=course.difficulty_level.value,
                estimated_duration_hours=course.estimated_duration_hours,
                rating=course.rating,
                enrolled_count=course.enrolled_count,
                is_free=course.is_free,
                price=course.price,
                tags=course.tags,
                created_at=course.created_at.isoformat() if course.created_at else ""
            )
            for course in courses
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"강사 코스 조회 실패: {str(e)}")


@router.post("/{course_id}/publish", response_model=CourseResponse)
async def publish_course(
    course_id: str,
    current_user: User = Depends(get_current_user),
    course_service: CourseService = Depends(get_course_service)
):
    """
    코스를 발행합니다.

    강사만 자신의 코스를 발행할 수 있습니다.
    """
    try:
        # 코스 존재 여부 및 권한 확인
        course = course_service.get_course_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="코스를 찾을 수 없습니다")

        if course.instructor_id != current_user.id:
            raise HTTPException(status_code=403, detail="코스 발행 권한이 없습니다")

        # 코스 발행
        published_course = course_service.publish_course(course_id)
        if not published_course:
            raise HTTPException(status_code=400, detail="코스 발행에 실패했습니다")

        return CourseResponse(
            id=published_course.id,
            title=published_course.title,
            slug=published_course.slug,
            description=published_course.description,
            short_description=published_course.short_description,
            status=published_course.status.value,
            difficulty_level=published_course.difficulty_level.value,
            estimated_duration_hours=published_course.estimated_duration_hours,
            learning_objectives=published_course.learning_objectives,
            target_audience=published_course.target_audience,
            tags=published_course.tags,
            categories=published_course.categories,
            instructor_id=published_course.instructor_id,
            rating=published_course.rating,
            enrolled_count=published_course.enrolled_count,
            is_ai_generated=published_course.is_ai_generated,
            is_free=published_course.is_free,
            price=published_course.price,
            created_at=published_course.created_at.isoformat(
            ) if published_course.created_at else "",
            updated_at=published_course.updated_at.isoformat(
            ) if published_course.updated_at else ""
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"코스 발행 실패: {str(e)}")
