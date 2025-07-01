"""
코스 관련 모델
코스, 모듈, 레슨, 진도 관리
"""
from sqlalchemy import Column, String, Boolean, Text, JSON, Enum, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from .base import BaseModel
from .user import SkillLevel
import enum


class CourseStatus(enum.Enum):
    """코스 상태"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class DifficultyLevel(enum.Enum):
    """난이도 수준"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class Course(BaseModel):
    """코스 모델"""
    __tablename__ = "courses"

    # 기본 정보
    title = Column(String(200), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)

    # 메타 정보
    thumbnail_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    tags = Column(JSON, nullable=True)  # ["AI", "machine_learning", "python"]
    # ["Computer Science", "Data Science"]
    categories = Column(JSON, nullable=True)

    # 코스 설정
    status = Column(Enum(CourseStatus), default=CourseStatus.DRAFT)
    difficulty_level = Column(Enum(DifficultyLevel),
                              default=DifficultyLevel.BEGINNER)
    estimated_duration_hours = Column(Integer, nullable=True)  # 예상 학습 시간

    # 요구사항
    prerequisites = Column(JSON, nullable=True)  # 선행 코스 또는 기술
    learning_objectives = Column(JSON, nullable=True)  # 학습 목표
    target_audience = Column(JSON, nullable=True)  # 대상 학습자

    # 강사 정보
    instructor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    instructor = relationship("User", backref="taught_courses")

    # 평가 및 통계
    rating = Column(Float, default=0.0)
    total_ratings = Column(Integer, default=0)
    enrolled_count = Column(Integer, default=0)
    completion_rate = Column(Float, default=0.0)

    # AI 생성 정보
    is_ai_generated = Column(Boolean, default=False)
    ai_generation_prompt = Column(Text, nullable=True)
    ai_model_used = Column(String(100), nullable=True)

    # 가격 정보 (향후)
    is_free = Column(Boolean, default=True)
    price = Column(Float, default=0.0)
    currency = Column(String(3), default="USD")

    # 발행 정보
    published_at = Column(DateTime, nullable=True)
    last_updated_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Course(title={self.title}, slug={self.slug})>"

    @property
    def is_published(self) -> bool:
        """발행 상태 확인"""
        return self.status == CourseStatus.PUBLISHED

    def to_summary_dict(self) -> dict:
        """요약 정보 딕셔너리"""
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "short_description": self.short_description,
            "thumbnail_url": self.thumbnail_url,
            "difficulty_level": self.difficulty_level.value if self.difficulty_level else None,
            "estimated_duration_hours": self.estimated_duration_hours,
            "rating": self.rating,
            "enrolled_count": self.enrolled_count,
            "is_free": self.is_free,
            "price": self.price,
            "tags": self.tags,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Module(BaseModel):
    """모듈 모델 (코스 내 섹션)"""
    __tablename__ = "modules"

    # 기본 정보
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    # 연결 정보
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    course = relationship("Course", backref="modules")

    # 학습 정보
    estimated_duration_minutes = Column(Integer, nullable=True)
    learning_objectives = Column(JSON, nullable=True)

    # 상태
    is_published = Column(Boolean, default=False)

    def __repr__(self):
        return f"<Module(title={self.title}, course_id={self.course_id})>"


class Lesson(BaseModel):
    """레슨 모델 (모듈 내 개별 학습 단위)"""
    __tablename__ = "lessons"

    # 기본 정보
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=True)  # 마크다운 형식
    order_index = Column(Integer, default=0)

    # 연결 정보
    module_id = Column(String(36), ForeignKey("modules.id"), nullable=False)
    module = relationship("Module", backref="lessons")

    # 콘텐츠 정보
    # text, video, interactive, quiz
    lesson_type = Column(String(50), default="text")
    content_url = Column(String(500), nullable=True)  # YouTube URL 등
    resources = Column(JSON, nullable=True)  # 추가 자료 링크

    # 학습 정보
    estimated_duration_minutes = Column(Integer, nullable=True)
    difficulty_points = Column(Integer, default=0)  # 난이도 점수

    # AI 생성 정보
    is_ai_generated = Column(Boolean, default=False)
    ai_generation_prompt = Column(Text, nullable=True)

    # 상태
    is_published = Column(Boolean, default=False)
    is_free_preview = Column(Boolean, default=False)

    def __repr__(self):
        return f"<Lesson(title={self.title}, module_id={self.module_id})>"


class Enrollment(BaseModel):
    """수강 신청 모델"""
    __tablename__ = "enrollments"

    # 연결 정보
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)

    user = relationship("User", backref="enrollments")
    course = relationship("Course", backref="enrollments")

    # 진도 정보
    progress_percentage = Column(Float, default=0.0)
    completed_lessons = Column(JSON, nullable=True)  # 완료한 레슨 ID 목록
    current_lesson_id = Column(String(36), nullable=True)

    # 학습 통계
    total_study_time_minutes = Column(Integer, default=0)
    quiz_scores = Column(JSON, nullable=True)  # 퀴즈 점수 기록

    # 상태
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    certificate_issued_at = Column(DateTime, nullable=True)

    # 평가
    rating = Column(Integer, nullable=True)  # 1-5 별점
    review = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Enrollment(user_id={self.user_id}, course_id={self.course_id})>"

    @property
    def is_in_progress(self) -> bool:
        """진행 중인지 확인"""
        return self.progress_percentage > 0 and not self.is_completed
