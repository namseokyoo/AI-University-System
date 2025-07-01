"""
데이터베이스 모델 패키지
모든 모델을 중앙에서 관리
"""
from .base import Base, BaseModel, TimestampMixin, UUIDMixin
from .user import User, UserRole, SkillLevel
from .course import (
    Course, Module, Lesson, Enrollment,
    CourseStatus, DifficultyLevel
)

# 모든 모델을 리스트로 내보내기
__all__ = [
    # Base models
    "Base",
    "BaseModel",
    "TimestampMixin",
    "UUIDMixin",

    # User models
    "User",
    "UserRole",
    "SkillLevel",

    # Course models
    "Course",
    "Module",
    "Lesson",
    "Enrollment",
    "CourseStatus",
    "DifficultyLevel",
]
