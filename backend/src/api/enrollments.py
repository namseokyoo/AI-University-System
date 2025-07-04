"""
수강신청 관리 API 엔드포인트
수강신청, 진도 관리, 완료 처리
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from ..core.database import get_db
from ..api.auth import get_current_user
from ..models.user import User
from ..models.course import Course, Enrollment

router = APIRouter(prefix="/enrollments", tags=["enrollments"])


# Pydantic 모델들
class EnrollmentRequest(BaseModel):
    """수강신청 요청"""
    course_id: str = Field(..., description="코스 ID")


class EnrollmentResponse(BaseModel):
    """수강신청 응답"""
    id: str
    user_id: str
    course_id: str
    progress_percentage: float
    completed_lessons: List[str]
    current_lesson_id: Optional[str]
    total_study_time_minutes: int
    is_completed: bool
    completed_at: Optional[str]
    rating: Optional[int]
    review: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class EnrollmentWithCourseResponse(BaseModel):
    """코스 정보가 포함된 수강신청 응답"""
    id: str
    user_id: str
    course_id: str
    progress_percentage: float
    completed_lessons: List[str]
    current_lesson_id: Optional[str]
    total_study_time_minutes: int
    is_completed: bool
    completed_at: Optional[str]
    rating: Optional[int]
    review: Optional[str]
    created_at: str
    updated_at: str

    # 코스 정보
    course: dict

    class Config:
        from_attributes = True


class ProgressUpdateRequest(BaseModel):
    """진도 업데이트 요청"""
    lesson_id: str = Field(..., description="완료한 레슨 ID")
    study_time_minutes: Optional[int] = Field(
        None, ge=0, description="학습 시간 (분)")


class ReviewRequest(BaseModel):
    """코스 리뷰 요청"""
    rating: int = Field(..., ge=1, le=5, description="별점 (1-5)")
    review: Optional[str] = Field(None, max_length=1000, description="리뷰 내용")


# API 엔드포인트들
@router.post("/", response_model=EnrollmentResponse, status_code=201)
async def enroll_course(
    enrollment_data: EnrollmentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    코스에 수강신청합니다.
    """
    try:
        # 코스 존재 확인
        course = db.query(Course).filter(
            Course.id == enrollment_data.course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="코스를 찾을 수 없습니다.")

        # 이미 수강신청했는지 확인
        existing_enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == enrollment_data.course_id
        ).first()

        if existing_enrollment:
            raise HTTPException(status_code=400, detail="이미 수강신청한 코스입니다.")

        # 수강신청 생성
        enrollment = Enrollment(
            user_id=current_user.id,
            course_id=enrollment_data.course_id,
            progress_percentage=0.0,
            completed_lessons=[],
            total_study_time_minutes=0,
            is_completed=False
        )

        db.add(enrollment)

        # 코스 수강생 수 업데이트
        course.enrolled_count += 1

        db.commit()
        db.refresh(enrollment)

        return EnrollmentResponse(
            id=enrollment.id,
            user_id=enrollment.user_id,
            course_id=enrollment.course_id,
            progress_percentage=enrollment.progress_percentage,
            completed_lessons=enrollment.completed_lessons or [],
            current_lesson_id=enrollment.current_lesson_id,
            total_study_time_minutes=enrollment.total_study_time_minutes,
            is_completed=enrollment.is_completed,
            completed_at=enrollment.completed_at.isoformat() if enrollment.completed_at else None,
            rating=enrollment.rating,
            review=enrollment.review,
            created_at=enrollment.created_at.isoformat() if enrollment.created_at else "",
            updated_at=enrollment.updated_at.isoformat() if enrollment.updated_at else ""
        )

    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"수강신청 실패: {str(e)}")


@router.get("/my", response_model=List[EnrollmentWithCourseResponse])
async def get_my_enrollments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    현재 사용자의 수강신청 목록을 조회합니다.
    """
    try:
        enrollments = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id
        ).all()

        result = []
        for enrollment in enrollments:
            course = db.query(Course).filter(
                Course.id == enrollment.course_id).first()

            result.append(EnrollmentWithCourseResponse(
                id=enrollment.id,
                user_id=enrollment.user_id,
                course_id=enrollment.course_id,
                progress_percentage=enrollment.progress_percentage,
                completed_lessons=enrollment.completed_lessons or [],
                current_lesson_id=enrollment.current_lesson_id,
                total_study_time_minutes=enrollment.total_study_time_minutes,
                is_completed=enrollment.is_completed,
                completed_at=enrollment.completed_at.isoformat() if enrollment.completed_at else None,
                rating=enrollment.rating,
                review=enrollment.review,
                created_at=enrollment.created_at.isoformat() if enrollment.created_at else "",
                updated_at=enrollment.updated_at.isoformat() if enrollment.updated_at else "",
                course={
                    'id': course.id,
                    'title': course.title,
                    'slug': course.slug,
                    'short_description': course.short_description,
                    'thumbnail_url': course.thumbnail_url,
                    'difficulty_level': course.difficulty_level.value,
                    'estimated_duration_hours': course.estimated_duration_hours,
                    'rating': course.rating,
                    'is_free': course.is_free,
                    'price': course.price
                } if course else {}
            ))

        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"수강신청 목록 조회 실패: {str(e)}")


@router.get("/{course_id}", response_model=EnrollmentResponse)
async def get_enrollment(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    특정 코스의 수강신청 정보를 조회합니다.
    """
    try:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        ).first()

        if not enrollment:
            raise HTTPException(status_code=404, detail="수강신청 정보를 찾을 수 없습니다.")

        return EnrollmentResponse(
            id=enrollment.id,
            user_id=enrollment.user_id,
            course_id=enrollment.course_id,
            progress_percentage=enrollment.progress_percentage,
            completed_lessons=enrollment.completed_lessons or [],
            current_lesson_id=enrollment.current_lesson_id,
            total_study_time_minutes=enrollment.total_study_time_minutes,
            is_completed=enrollment.is_completed,
            completed_at=enrollment.completed_at.isoformat() if enrollment.completed_at else None,
            rating=enrollment.rating,
            review=enrollment.review,
            created_at=enrollment.created_at.isoformat() if enrollment.created_at else "",
            updated_at=enrollment.updated_at.isoformat() if enrollment.updated_at else ""
        )

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"수강신청 정보 조회 실패: {str(e)}")


@router.patch("/{course_id}/progress", response_model=EnrollmentResponse)
async def update_progress(
    course_id: str,
    progress_data: ProgressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    학습 진도를 업데이트합니다.
    """
    try:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        ).first()

        if not enrollment:
            raise HTTPException(status_code=404, detail="수강신청 정보를 찾을 수 없습니다.")

        # 완료한 레슨 목록에 추가
        completed_lessons = enrollment.completed_lessons or []
        if progress_data.lesson_id not in completed_lessons:
            completed_lessons.append(progress_data.lesson_id)
            enrollment.completed_lessons = completed_lessons

        # 현재 레슨 업데이트
        enrollment.current_lesson_id = progress_data.lesson_id

        # 학습 시간 업데이트
        if progress_data.study_time_minutes:
            enrollment.total_study_time_minutes += progress_data.study_time_minutes

        # 진도율 계산 (임시로 완료한 레슨 수 기준)
        # 실제로는 코스의 전체 레슨 수를 조회해서 계산해야 함
        enrollment.progress_percentage = min(
            len(completed_lessons) * 10.0, 100.0)

        # 완료 처리
        if enrollment.progress_percentage >= 100.0:
            enrollment.is_completed = True
            if not enrollment.completed_at:
                from datetime import datetime
                enrollment.completed_at = datetime.utcnow()

        db.commit()
        db.refresh(enrollment)

        return EnrollmentResponse(
            id=enrollment.id,
            user_id=enrollment.user_id,
            course_id=enrollment.course_id,
            progress_percentage=enrollment.progress_percentage,
            completed_lessons=enrollment.completed_lessons or [],
            current_lesson_id=enrollment.current_lesson_id,
            total_study_time_minutes=enrollment.total_study_time_minutes,
            is_completed=enrollment.is_completed,
            completed_at=enrollment.completed_at.isoformat() if enrollment.completed_at else None,
            rating=enrollment.rating,
            review=enrollment.review,
            created_at=enrollment.created_at.isoformat() if enrollment.created_at else "",
            updated_at=enrollment.updated_at.isoformat() if enrollment.updated_at else ""
        )

    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"진도 업데이트 실패: {str(e)}")


@router.post("/{course_id}/review", response_model=EnrollmentResponse)
async def submit_review(
    course_id: str,
    review_data: ReviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    코스 리뷰를 작성합니다.
    """
    try:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        ).first()

        if not enrollment:
            raise HTTPException(status_code=404, detail="수강신청 정보를 찾을 수 없습니다.")

        # 리뷰 업데이트
        enrollment.rating = review_data.rating
        enrollment.review = review_data.review

        # 코스 평점 업데이트
        course = db.query(Course).filter(Course.id == course_id).first()
        if course:
            # 모든 리뷰의 평균 계산
            enrollments_with_rating = db.query(Enrollment).filter(
                Enrollment.course_id == course_id,
                Enrollment.rating.isnot(None)
            ).all()

            if enrollments_with_rating:
                total_rating = sum(e.rating for e in enrollments_with_rating)
                course.rating = total_rating / len(enrollments_with_rating)
                course.total_ratings = len(enrollments_with_rating)

        db.commit()
        db.refresh(enrollment)

        return EnrollmentResponse(
            id=enrollment.id,
            user_id=enrollment.user_id,
            course_id=enrollment.course_id,
            progress_percentage=enrollment.progress_percentage,
            completed_lessons=enrollment.completed_lessons or [],
            current_lesson_id=enrollment.current_lesson_id,
            total_study_time_minutes=enrollment.total_study_time_minutes,
            is_completed=enrollment.is_completed,
            completed_at=enrollment.completed_at.isoformat() if enrollment.completed_at else None,
            rating=enrollment.rating,
            review=enrollment.review,
            created_at=enrollment.created_at.isoformat() if enrollment.created_at else "",
            updated_at=enrollment.updated_at.isoformat() if enrollment.updated_at else ""
        )

    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"리뷰 작성 실패: {str(e)}")


@router.delete("/{course_id}", status_code=204)
async def unenroll_course(
    course_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    코스 수강신청을 취소합니다.
    """
    try:
        enrollment = db.query(Enrollment).filter(
            Enrollment.user_id == current_user.id,
            Enrollment.course_id == course_id
        ).first()

        if not enrollment:
            raise HTTPException(status_code=404, detail="수강신청 정보를 찾을 수 없습니다.")

        # 수강신청 삭제
        db.delete(enrollment)

        # 코스 수강생 수 업데이트
        course = db.query(Course).filter(Course.id == course_id).first()
        if course and course.enrolled_count > 0:
            course.enrolled_count -= 1

        db.commit()

    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"수강신청 취소 실패: {str(e)}")
