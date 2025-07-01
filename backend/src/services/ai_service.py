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


class DeepseekAIService:
    """Deepseek AI API 서비스"""

    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.base_url = settings.DEEPSEEK_BASE_URL
        self.model = settings.DEEPSEEK_MODEL
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
            logger.warning("Deepseek API key not configured")
            return None

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
                return None

        except Exception as e:
            logger.error(f"Error generating chat completion: {str(e)}")
            return None

    async def generate_course_outline(
        self,
        topic: str,
        skill_level: str,
        duration_hours: int,
        learning_goals: List[str]
    ) -> Optional[Dict[str, Any]]:
        """AI 기반 코스 개요 생성"""
        prompt = f"""
        Create a comprehensive course outline for "{topic}" with the following requirements:
        - Target skill level: {skill_level}
        - Duration: {duration_hours} hours
        - Learning goals: {', '.join(learning_goals)}
        
        Please provide a JSON structure with:
        1. Course title and description
        2. Learning objectives
        3. Prerequisites
        4. Module breakdown with lessons
        5. Estimated time for each module
        
        Format the response as valid JSON.
        """

        messages = [
            {"role": "system", "content": "You are an expert curriculum designer for AI education."},
            {"role": "user", "content": prompt}
        ]

        response = await self.generate_chat_completion(messages, max_tokens=2000)

        if response:
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                logger.error("Failed to parse course outline JSON")
                return None

        return None

    async def generate_lesson_content(
        self,
        lesson_title: str,
        learning_objectives: List[str],
        difficulty_level: str,
        duration_minutes: int
    ) -> Optional[str]:
        """AI 기반 레슨 콘텐츠 생성"""
        prompt = f"""
        Create detailed lesson content for "{lesson_title}" with:
        - Learning objectives: {', '.join(learning_objectives)}
        - Difficulty level: {difficulty_level}
        - Duration: {duration_minutes} minutes
        
        Please provide:
        1. Introduction
        2. Main content with examples
        3. Practical exercises
        4. Summary and key takeaways
        
        Format in Markdown.
        """

        messages = [
            {"role": "system", "content": "You are an expert AI instructor creating educational content."},
            {"role": "user", "content": prompt}
        ]

        return await self.generate_chat_completion(messages, max_tokens=3000)

    async def personalize_learning_path(
        self,
        user_profile: Dict[str, Any],
        available_courses: List[Dict[str, Any]],
        learning_goals: List[str]
    ) -> Optional[List[str]]:
        """사용자 맞춤 학습 경로 추천"""
        prompt = f"""
        Based on this user profile:
        - Skill level: {user_profile.get('skill_level', 'beginner')}
        - Learning goals: {', '.join(learning_goals)}
        - Completed courses: {user_profile.get('completed_courses', 0)}
        - Study time: {user_profile.get('total_study_hours', 0)} hours
        
        Available courses: {json.dumps(available_courses, indent=2)}
        
        Recommend an optimal learning path (course IDs in order) with reasoning.
        Return as JSON array of course IDs.
        """

        messages = [
            {"role": "system", "content": "You are an AI learning advisor specializing in personalized education paths."},
            {"role": "user", "content": prompt}
        ]

        response = await self.generate_chat_completion(messages, max_tokens=1000)

        if response:
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                logger.error("Failed to parse learning path JSON")
                return None

        return None

    async def evaluate_user_response(
        self,
        question: str,
        user_answer: str,
        expected_answer: str,
        context: str = ""
    ) -> Optional[Dict[str, Any]]:
        """사용자 답변 AI 평가"""
        prompt = f"""
        Evaluate this user's answer:
        
        Question: {question}
        User Answer: {user_answer}
        Expected Answer: {expected_answer}
        Context: {context}
        
        Provide evaluation as JSON:
        {{
            "score": 0-100,
            "feedback": "detailed feedback",
            "is_correct": true/false,
            "suggestions": ["improvement suggestions"]
        }}
        """

        messages = [
            {"role": "system", "content": "You are an AI tutor providing detailed feedback on student answers."},
            {"role": "user", "content": prompt}
        ]

        response = await self.generate_chat_completion(messages, max_tokens=800)

        if response:
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                logger.error("Failed to parse evaluation JSON")
                return None

        return None


# 싱글톤 AI 서비스 인스턴스
ai_service = DeepseekAIService()
