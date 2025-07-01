"""
구조화된 로깅 시스템 설정
개발 및 프로덕션 환경별 로깅 구성
"""
import logging
import sys
from typing import Any, Dict
import structlog
from .config import settings


def setup_logging() -> None:
    """애플리케이션 로깅 설정"""

    # 로그 레벨 설정
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    # 기본 로깅 설정
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=log_level,
    )

    # Structlog 설정
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="ISO"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer() if settings.ENVIRONMENT == "production"
            else structlog.dev.ConsoleRenderer(),
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    """구조화된 로거 인스턴스 반환"""
    return structlog.get_logger(name)


# 애플리케이션별 로거들
api_logger = get_logger("api")
auth_logger = get_logger("auth")
ai_logger = get_logger("ai")
db_logger = get_logger("database")
cache_logger = get_logger("cache")

# 로깅 유틸리티 함수들


def log_api_request(method: str, path: str, user_id: str = None, **kwargs) -> None:
    """API 요청 로깅"""
    api_logger.info(
        "API request",
        method=method,
        path=path,
        user_id=user_id,
        **kwargs
    )


def log_ai_interaction(action: str, model: str, tokens_used: int = None, **kwargs) -> None:
    """AI API 상호작용 로깅"""
    ai_logger.info(
        "AI interaction",
        action=action,
        model=model,
        tokens_used=tokens_used,
        **kwargs
    )


def log_database_operation(operation: str, table: str, duration: float = None, **kwargs) -> None:
    """데이터베이스 작업 로깅"""
    db_logger.info(
        "Database operation",
        operation=operation,
        table=table,
        duration_ms=duration,
        **kwargs
    )


def log_cache_operation(operation: str, key: str, hit: bool = None, **kwargs) -> None:
    """캐시 작업 로깅"""
    cache_logger.info(
        "Cache operation",
        operation=operation,
        key=key,
        cache_hit=hit,
        **kwargs
    )
