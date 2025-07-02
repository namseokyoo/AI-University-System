"""
AI 서비스
Deepseek API 연동 및 AI 기반 기능 제공
"""
import httpx
import json
from typing import Optional, List, Dict, Any
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)


class AIService:
    """AI 기반 교육 서비스 - Deepseek API 사용"""

    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.base_url = settings.DEEPSEEK_BASE_URL or "https://api.deepseek.com/v1"
        self.model = "deepseek-chat"
        self.client = httpx.AsyncClient()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()

    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> Optional[str]:
        """채팅 완성 생성"""
        if not self.api_key:
            logger.warning(
                "Deepseek API key not configured, returning mock response")
            return self._get_mock_response(messages)

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                **kwargs
            }

            response = await self.client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30.0
            )

            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                logger.error(
                    f"Deepseek API error: {response.status_code} - {response.text}")
                return self._get_mock_response(messages)

        except Exception as e:
            logger.error(f"Error generating chat completion: {str(e)}")
            return self._get_mock_response(messages)

    async def generate_course_structure(
        self,
        topic: str,
        difficulty_level: str,
        target_hours: int,
        additional_requirements: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        AI를 사용하여 완전한 코스 구조를 생성합니다.

        Args:
            topic: 코스 주제
            difficulty_level: 난이도 (beginner, intermediate, advanced, expert)
            target_hours: 목표 학습 시간 (시간)
            additional_requirements: 추가 요구사항

        Returns:
            완전한 코스 구조 (제목, 설명, 모듈, 레슨 포함)
        """
        prompt = f"""
다음 요구사항에 맞는 완전한 온라인 코스 구조를 JSON 형식으로 생성해주세요:

**코스 주제**: {topic}
**난이도**: {difficulty_level}
**목표 학습 시간**: {target_hours}시간
**추가 요구사항**: {additional_requirements or "없음"}

다음 JSON 구조로 응답해주세요:

{{
    "title": "코스 제목",
    "description": "코스에 대한 상세 설명 (3-4문장)",
    "learning_objectives": [
        "구체적인 학습 목표 1",
        "구체적인 학습 목표 2",
        "구체적인 학습 목표 3"
    ],
    "target_audience": [
        "대상 학습자 그룹 1",
        "대상 학습자 그룹 2"
    ],
    "tags": ["태그1", "태그2", "태그3", "태그4"],
    "categories": ["카테고리1", "카테고리2"],
    "modules": [
        {{
            "title": "모듈 1 제목",
            "description": "모듈 설명",
            "order_index": 0,
            "estimated_duration_minutes": 120,
            "learning_objectives": ["모듈별 학습 목표"],
            "lessons": [
                {{
                    "title": "레슨 1.1 제목",
                    "order_index": 0,
                    "lesson_type": "text",
                    "content": "레슨 내용 개요",
                    "estimated_duration_minutes": 30
                }},
                {{
                    "title": "레슨 1.2 제목", 
                    "order_index": 1,
                    "lesson_type": "video",
                    "content": "레슨 내용 개요",
                    "estimated_duration_minutes": 25
                }}
            ]
        }},
        {{
            "title": "모듈 2 제목",
            "description": "모듈 설명",
            "order_index": 1,
            "estimated_duration_minutes": 150,
            "learning_objectives": ["모듈별 학습 목표"],
            "lessons": [
                {{
                    "title": "레슨 2.1 제목",
                    "order_index": 0,
                    "lesson_type": "interactive",
                    "content": "레슨 내용 개요",
                    "estimated_duration_minutes": 40
                }}
            ]
        }}
    ]
}}

요구사항:
1. 전체 {target_hours}시간에 맞게 모듈과 레슨을 구성
2. {difficulty_level} 수준에 적합한 내용 구성
3. 각 모듈은 3-5개의 레슨으로 구성
4. 레슨 타입은 "text", "video", "interactive", "quiz" 중 선택
5. 실용적이고 구체적인 학습 목표 설정
6. 한국어로 작성

JSON만 응답하고 다른 설명은 포함하지 마세요.
"""

        messages = [
            {
                "role": "system",
                "content": "당신은 전문적인 교육 커리큘럼 설계자입니다. 실용적이고 체계적인 온라인 코스를 설계하는 전문가입니다."
            },
            {"role": "user", "content": prompt}
        ]

        response = await self.generate_chat_completion(messages, max_tokens=4000, temperature=0.7)

        if response:
            try:
                # JSON 응답 파싱
                course_structure = json.loads(response.strip())
                return course_structure
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse course structure JSON: {e}")
                logger.error(f"Response was: {response}")
                return self._get_mock_course_structure(topic, difficulty_level, target_hours)

        return self._get_mock_course_structure(topic, difficulty_level, target_hours)

    async def generate_lesson_content(
        self,
        lesson_title: str,
        learning_objectives: List[str],
        difficulty_level: str,
        duration_minutes: int,
        lesson_type: str = "text"
    ) -> Optional[str]:
        """AI 기반 레슨 콘텐츠 생성"""
        prompt = f"""
"{lesson_title}" 레슨의 상세 콘텐츠를 생성해주세요.

**학습 목표**: {', '.join(learning_objectives)}
**난이도**: {difficulty_level}
**예상 소요 시간**: {duration_minutes}분
**레슨 타입**: {lesson_type}

다음 구조로 마크다운 형식으로 작성해주세요:

# {lesson_title}

## 🎯 학습 목표
- 목표 1
- 목표 2

## 📖 내용

### 1. 개념 소개
[핵심 개념 설명]

### 2. 상세 설명
[구체적인 내용과 예시]

### 3. 실습 예제
[코드나 실습 예제]

## 💡 핵심 포인트
- 주요 내용 요약

## 🔍 추가 학습 자료
- 참고 링크나 자료

## ✅ 체크 포인트
- 이해도 확인 질문들

실용적이고 이해하기 쉽게 작성해주세요.
"""

        messages = [
            {"role": "system", "content": "당신은 전문적인 AI 교육 강사입니다. 학습자가 쉽게 이해할 수 있는 교육 콘텐츠를 만드는 전문가입니다."},
            {"role": "user", "content": prompt}
        ]

        return await self.generate_chat_completion(messages, max_tokens=3000, temperature=0.7)

    def _get_mock_response(self, messages: List[Dict[str, str]]) -> str:
        """API 키가 없을 때 사용할 목 응답"""
        last_message = messages[-1]["content"]

        if "course structure" in last_message.lower() or "코스 구조" in last_message:
            return json.dumps(self._get_mock_course_structure("AI 기초", "beginner", 10))
        elif "lesson content" in last_message.lower() or "레슨 콘텐츠" in last_message:
            return "# 샘플 레슨\n\n이것은 샘플 레슨 콘텐츠입니다. 실제 AI API가 연동되면 자동으로 생성됩니다."
        else:
            return "AI API 키가 설정되지 않아 목 응답을 반환합니다."

    def _get_mock_course_structure(self, topic: str, difficulty_level: str, target_hours: int) -> Dict[str, Any]:
        """목 코스 구조 데이터"""
        return {
            "title": f"{topic} 완전 정복",
            "description": f"{topic}의 기초부터 실전까지 단계별로 학습하는 완전한 코스입니다. {difficulty_level} 수준의 학습자를 위해 설계되었으며, 실습 위주의 학습을 통해 실무 능력을 기를 수 있습니다.",
            "learning_objectives": [
                f"{topic}의 핵심 개념을 이해한다",
                f"{topic}를 활용한 실전 프로젝트를 완성한다",
                f"{topic} 관련 문제를 독립적으로 해결할 수 있다"
            ],
            "target_audience": [
                f"{topic}을 처음 배우는 초보자",
                f"{topic} 관련 업무를 시작하려는 직장인",
                "프로그래밍에 관심있는 학생"
            ],
            "tags": [topic.lower(), difficulty_level, "실습", "프로젝트"],
            "categories": ["Technology", "Programming"],
            "modules": [
                {
                    "title": f"{topic} 기초 개념",
                    "description": f"{topic}의 기본 개념과 원리를 학습합니다",
                    "order_index": 0,
                    "estimated_duration_minutes": target_hours * 60 // 3,
                    "learning_objectives": [f"{topic} 기본 개념 이해"],
                    "lessons": [
                        {
                            "title": f"{topic} 소개",
                            "order_index": 0,
                            "lesson_type": "text",
                            "content": f"{topic}의 정의와 활용 분야를 소개합니다",
                            "estimated_duration_minutes": 30
                        },
                        {
                            "title": "핵심 개념 이해",
                            "order_index": 1,
                            "lesson_type": "video",
                            "content": "핵심 개념들을 예시와 함께 설명합니다",
                            "estimated_duration_minutes": 40
                        }
                    ]
                },
                {
                    "title": "실습과 응용",
                    "description": "실제 예제를 통해 실습해봅니다",
                    "order_index": 1,
                    "estimated_duration_minutes": target_hours * 60 // 2,
                    "learning_objectives": ["실습을 통한 이해도 향상"],
                    "lessons": [
                        {
                            "title": "첫 번째 실습",
                            "order_index": 0,
                            "lesson_type": "interactive",
                            "content": "기본적인 실습을 진행합니다",
                            "estimated_duration_minutes": 45
                        },
                        {
                            "title": "프로젝트 실습",
                            "order_index": 1,
                            "lesson_type": "quiz",
                            "content": "종합적인 프로젝트를 진행합니다",
                            "estimated_duration_minutes": 60
                        }
                    ]
                }
            ]
        }


# 기존 DeepseekAIService를 AIService로 통합하여 호환성 유지
DeepseekAIService = AIService

# 전역 인스턴스 생성
ai_service = AIService()
