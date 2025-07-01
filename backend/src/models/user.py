"""
사용자 모델
사용자 정보, 인증, 프로필 관리
"""
from sqlalchemy import Column, String, Boolean, Text, JSON, Enum, Integer, DateTime
from sqlalchemy.orm import relationship
from .base import BaseModel
import enum


class UserRole(enum.Enum):
    """사용자 역할"""
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"


class SkillLevel(enum.Enum):
    """기술 수준"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class User(BaseModel):
    """사용자 모델"""
    __tablename__ = "users"

    # 기본 정보
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # 프로필 정보
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    full_name = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)

    # 연락처 정보
    phone = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    timezone = Column(String(50), default="UTC")

    # 계정 상태
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)

    # 사용자 역할 및 권한
    role = Column(Enum(UserRole), default=UserRole.STUDENT)

    # AI 학습 프로필
    current_skill_level = Column(Enum(SkillLevel), default=SkillLevel.BEGINNER)
    # ["machine_learning", "deep_learning"]
    learning_goals = Column(JSON, nullable=True)
    # visual, auditory, kinesthetic
    preferred_learning_style = Column(String(50), nullable=True)

    # 학습 통계
    total_study_hours = Column(Integer, default=0)
    courses_completed = Column(Integer, default=0)
    achievements = Column(JSON, nullable=True)  # 획득한 배지, 인증서 등

    # 개인화 설정
    language = Column(String(10), default="ko")
    notification_preferences = Column(JSON, nullable=True)
    ui_preferences = Column(JSON, nullable=True)

    # 소셜 연결
    github_username = Column(String(100), nullable=True)
    linkedin_profile = Column(String(200), nullable=True)

    # 구독 정보
    subscription_started_at = Column(DateTime, nullable=True)
    subscription_ends_at = Column(DateTime, nullable=True)

    # 마지막 활동
    last_login_at = Column(DateTime, nullable=True)
    last_activity_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"

    @property
    def display_name(self) -> str:
        """표시용 이름"""
        if self.full_name:
            return self.full_name
        elif self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        else:
            return self.username

    @property
    def is_instructor(self) -> bool:
        """강사인지 확인"""
        return self.role == UserRole.INSTRUCTOR

    @property
    def is_admin(self) -> bool:
        """관리자인지 확인"""
        return self.role == UserRole.ADMIN

    def to_public_dict(self) -> dict:
        """공개 정보만 포함한 딕셔너리"""
        return {
            "id": self.id,
            "username": self.username,
            "display_name": self.display_name,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "role": self.role.value if self.role else None,
            "current_skill_level": self.current_skill_level.value if self.current_skill_level else None,
            "total_study_hours": self.total_study_hours,
            "courses_completed": self.courses_completed,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
