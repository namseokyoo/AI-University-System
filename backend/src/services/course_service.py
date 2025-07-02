"""
코스 관리 서비스
코스 생성, 조회, AI 기반 코스 생성 기능
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from ..models.course import Course, Module, Lesson, CourseStatus, DifficultyLevel
from ..models.user import User
from .ai_service import AIService
import re
import uuid


class CourseService:
    """코스 관리 서비스"""

    def __init__(self, db: Session, ai_service: AIService):
        self.db = db
        self.ai_service = ai_service

    def create_course(
        self,
        title: str,
        description: str,
        instructor_id: str,
        difficulty_level: str = "beginner",
        estimated_duration_hours: Optional[int] = None,
        learning_objectives: Optional[List[str]] = None,
        target_audience: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        categories: Optional[List[str]] = None,
        is_ai_generated: bool = False,
        ai_generation_prompt: Optional[str] = None
    ) -> Course:
        """
        새로운 코스를 생성합니다.

        Args:
            title: 코스 제목
            description: 코스 설명
            instructor_id: 강사 ID
            difficulty_level: 난이도 (beginner, intermediate, advanced, expert)
            estimated_duration_hours: 예상 학습 시간
            learning_objectives: 학습 목표 목록
            target_audience: 대상 학습자 목록
            tags: 태그 목록
            categories: 카테고리 목록
            is_ai_generated: AI 생성 여부
            ai_generation_prompt: AI 생성 프롬프트

        Returns:
            생성된 코스 객체
        """
        # 슬러그 생성 (제목에서 URL 친화적 문자열로 변환)
        slug = self._generate_slug(title)

        # 중복 슬러그 체크 및 수정
        slug = self._ensure_unique_slug(slug)

        # 코스 객체 생성
        course = Course(
            title=title,
            slug=slug,
            description=description,
            short_description=description[:500] if description else None,
            status=CourseStatus.DRAFT,
            difficulty_level=DifficultyLevel(difficulty_level),
            estimated_duration_hours=estimated_duration_hours,
            learning_objectives=learning_objectives or [],
            target_audience=target_audience or [],
            tags=tags or [],
            categories=categories or [],
            instructor_id=instructor_id,
            is_ai_generated=is_ai_generated,
            ai_generation_prompt=ai_generation_prompt
        )

        # 데이터베이스 저장
        self.db.add(course)
        self.db.commit()
        self.db.refresh(course)

        return course

    def get_course_by_id(self, course_id: str) -> Optional[Course]:
        """
        ID로 코스를 조회합니다.

        Args:
            course_id: 코스 ID

        Returns:
            코스 객체 또는 None
        """
        return self.db.query(Course).filter(Course.id == course_id).first()

    def get_course_by_slug(self, slug: str) -> Optional[Course]:
        """
        슬러그로 코스를 조회합니다.

        Args:
            slug: 코스 슬러그

        Returns:
            코스 객체 또는 None
        """
        return self.db.query(Course).filter(Course.slug == slug).first()

    def get_courses(
        self,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None,
        difficulty_level: Optional[str] = None,
        tags: Optional[List[str]] = None,
        categories: Optional[List[str]] = None,
        search: Optional[str] = None
    ) -> List[Course]:
        """
        코스 목록을 조회합니다.

        Args:
            skip: 건너뛸 개수
            limit: 조회할 개수
            status: 상태 필터
            difficulty_level: 난이도 필터
            tags: 태그 필터
            categories: 카테고리 필터
            search: 검색어

        Returns:
            코스 목록
        """
        query = self.db.query(Course)

        # 상태 필터
        if status:
            query = query.filter(Course.status == CourseStatus(status))

        # 난이도 필터
        if difficulty_level:
            query = query.filter(Course.difficulty_level ==
                                 DifficultyLevel(difficulty_level))

        # 태그 필터 (JSONB 배열 검색)
        if tags:
            for tag in tags:
                query = query.filter(Course.tags.contains([tag]))

        # 카테고리 필터
        if categories:
            for category in categories:
                query = query.filter(Course.categories.contains([category]))

        # 검색어 필터 (제목, 설명에서 검색)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                Course.title.ilike(search_filter) |
                Course.description.ilike(search_filter)
            )

        # 정렬 및 페이징
        return query.order_by(Course.created_at.desc()).offset(skip).limit(limit).all()

    def get_published_courses(self, skip: int = 0, limit: int = 20) -> List[Course]:
        """
        발행된 코스 목록을 조회합니다.

        Args:
            skip: 건너뛸 개수
            limit: 조회할 개수

        Returns:
            발행된 코스 목록
        """
        return self.get_courses(skip=skip, limit=limit, status="published")

    def get_instructor_courses(self, instructor_id: str) -> List[Course]:
        """
        강사의 코스 목록을 조회합니다.

        Args:
            instructor_id: 강사 ID

        Returns:
            강사의 코스 목록
        """
        return self.db.query(Course).filter(Course.instructor_id == instructor_id).all()

    async def create_ai_course(
        self,
        topic: str,
        difficulty_level: str,
        target_hours: int,
        instructor_id: str,
        additional_requirements: Optional[str] = None
    ) -> Course:
        """
        AI를 사용하여 코스를 생성합니다.

        Args:
            topic: 코스 주제
            difficulty_level: 난이도
            target_hours: 목표 학습 시간
            instructor_id: 강사 ID
            additional_requirements: 추가 요구사항

        Returns:
            생성된 코스 객체
        """
        # AI 서비스를 통해 코스 구조 생성
        course_structure = await self.ai_service.generate_course_structure(
            topic=topic,
            difficulty_level=difficulty_level,
            target_hours=target_hours,
            additional_requirements=additional_requirements
        )

        # 코스 기본 정보 생성
        course = self.create_course(
            title=course_structure["title"],
            description=course_structure["description"],
            instructor_id=instructor_id,
            difficulty_level=difficulty_level,
            estimated_duration_hours=target_hours,
            learning_objectives=course_structure["learning_objectives"],
            target_audience=course_structure["target_audience"],
            tags=course_structure["tags"],
            categories=course_structure["categories"],
            is_ai_generated=True,
            ai_generation_prompt=f"Topic: {topic}, Level: {difficulty_level}, Hours: {target_hours}"
        )

        # 모듈 및 레슨 생성
        for module_data in course_structure["modules"]:
            module = Module(
                title=module_data["title"],
                description=module_data["description"],
                order_index=module_data["order_index"],
                course_id=course.id,
                estimated_duration_minutes=module_data.get(
                    "estimated_duration_minutes", 60),
                learning_objectives=module_data.get("learning_objectives", [])
            )
            self.db.add(module)
            self.db.flush()  # ID 생성을 위해 flush

            # 레슨 생성
            for lesson_data in module_data["lessons"]:
                lesson = Lesson(
                    title=lesson_data["title"],
                    content=lesson_data.get("content", ""),
                    order_index=lesson_data["order_index"],
                    module_id=module.id,
                    lesson_type=lesson_data.get("lesson_type", "text"),
                    estimated_duration_minutes=lesson_data.get(
                        "estimated_duration_minutes", 20),
                    is_ai_generated=True
                )
                self.db.add(lesson)

        self.db.commit()
        self.db.refresh(course)

        return course

    def publish_course(self, course_id: str) -> Optional[Course]:
        """
        코스를 발행합니다.

        Args:
            course_id: 코스 ID

        Returns:
            업데이트된 코스 객체 또는 None
        """
        course = self.get_course_by_id(course_id)
        if not course:
            return None

        course.status = CourseStatus.PUBLISHED
        course.published_at = course.updated_at

        self.db.commit()
        self.db.refresh(course)

        return course

    def _generate_slug(self, title: str) -> str:
        """
        제목에서 URL 친화적 슬러그를 생성합니다.

        Args:
            title: 코스 제목

        Returns:
            생성된 슬러그
        """
        # 한글을 영문으로 변환하지 않고 유지
        slug = title.lower()
        # 특수문자를 하이픈으로 변환
        slug = re.sub(r'[^\w\s-]', '', slug)
        # 공백을 하이픈으로 변환
        slug = re.sub(r'[-\s]+', '-', slug)
        # 앞뒤 하이픈 제거
        slug = slug.strip('-')

        return slug or f"course-{uuid.uuid4().hex[:8]}"

    def _ensure_unique_slug(self, slug: str) -> str:
        """
        중복되지 않는 슬러그를 보장합니다.

        Args:
            slug: 원래 슬러그

        Returns:
            고유한 슬러그
        """
        original_slug = slug
        counter = 1

        while self.db.query(Course).filter(Course.slug == slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1

        return slug
