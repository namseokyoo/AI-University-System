"""
데이터베이스 연결 설정
Supabase PostgreSQL 연결 관리
"""
from typing import AsyncGenerator
import asyncpg
from asyncpg import Pool, Connection
from .config import settings
import logging

logger = logging.getLogger(__name__)

# 데이터베이스 연결 풀
db_pool: Pool = None


async def init_db() -> None:
    """데이터베이스 연결 풀 초기화"""
    global db_pool

    if not settings.SUPABASE_URL:
        logger.warning(
            "SUPABASE_URL not configured, database features will be disabled")
        return

    try:
        # Supabase URL에서 PostgreSQL 연결 문자열 추출
        database_url = settings.SUPABASE_URL.replace(
            'https://', 'postgresql://postgres:')
        database_url = f"{database_url}:5432/postgres?sslmode=require"

        # 연결 풀 생성
        db_pool = await asyncpg.create_pool(
            database_url,
            min_size=1,
            max_size=10,
            command_timeout=60,
            server_settings={
                'application_name': 'ai-university-backend',
            }
        )

        logger.info("Database connection pool initialized successfully")

    except Exception as e:
        logger.error(f"Failed to initialize database connection pool: {e}")
        db_pool = None


async def close_db() -> None:
    """데이터베이스 연결 풀 종료"""
    global db_pool

    if db_pool:
        await db_pool.close()
        db_pool = None
        logger.info("Database connection pool closed")


async def get_db() -> AsyncGenerator[Connection, None]:
    """
    데이터베이스 연결을 제공하는 의존성 주입 함수
    FastAPI dependency로 사용
    """
    if not db_pool:
        logger.error("Database pool not initialized")
        raise RuntimeError("Database not available")

    async with db_pool.acquire() as connection:
        try:
            yield connection
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            raise
        finally:
            # 연결은 자동으로 풀에 반환됨
            pass


async def execute_query(
    query: str,
    *args,
    fetch_one: bool = False,
    fetch_all: bool = False
):
    """
    데이터베이스 쿼리 실행 헬퍼 함수

    Args:
        query: SQL 쿼리
        *args: 쿼리 파라미터
        fetch_one: 단일 결과 반환
        fetch_all: 모든 결과 반환

    Returns:
        쿼리 결과 또는 None
    """
    if not db_pool:
        logger.error("Database pool not initialized")
        return None

    async with db_pool.acquire() as connection:
        try:
            if fetch_one:
                return await connection.fetchrow(query, *args)
            elif fetch_all:
                return await connection.fetch(query, *args)
            else:
                return await connection.execute(query, *args)
        except Exception as e:
            logger.error(f"Query execution error: {e}")
            logger.error(f"Query: {query}")
            logger.error(f"Args: {args}")
            raise


async def execute_transaction(queries_and_params: list):
    """
    트랜잭션으로 여러 쿼리 실행

    Args:
        queries_and_params: [(query, params), ...] 형태의 리스트

    Returns:
        성공 여부
    """
    if not db_pool:
        logger.error("Database pool not initialized")
        return False

    async with db_pool.acquire() as connection:
        async with connection.transaction():
            try:
                for query, params in queries_and_params:
                    await connection.execute(query, *params)
                return True
            except Exception as e:
                logger.error(f"Transaction error: {e}")
                # 트랜잭션은 자동으로 롤백됨
                raise


# Supabase REST API 클라이언트 (백업용)
class SupabaseClient:
    """Supabase REST API 클라이언트 (asyncpg 백업용)"""

    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.service_key = settings.SUPABASE_SERVICE_KEY

    @property
    def headers(self):
        return {
            "apikey": self.key,
            "Authorization": f"Bearer {self.service_key or self.key}",
            "Content-Type": "application/json"
        }

    def is_available(self) -> bool:
        """Supabase 설정이 유효한지 확인"""
        return bool(self.url and self.key)


# 전역 Supabase 클라이언트 인스턴스
supabase_client = SupabaseClient()
