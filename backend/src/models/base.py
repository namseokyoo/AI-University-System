"""
기본 데이터베이스 모델
공통 필드 및 설정 정의
"""
from sqlalchemy import Column, Integer, DateTime, String, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional
import uuid

Base = declarative_base()


class TimestampMixin:
    """타임스탬프 공통 필드"""
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(),
                        onupdate=func.now(), nullable=False)


class UUIDMixin:
    """UUID 기본 키 공통 필드"""
    id = Column(String(36), primary_key=True,
                default=lambda: str(uuid.uuid4()))


class BaseModel(Base, UUIDMixin, TimestampMixin):
    """모든 모델의 기본 클래스"""
    __abstract__ = True

    def to_dict(self) -> dict:
        """모델을 딕셔너리로 변환"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}({self.id})>"
