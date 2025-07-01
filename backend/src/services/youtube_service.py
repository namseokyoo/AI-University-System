"""
YouTube 서비스
YouTube Data API v3 연동 및 교육 콘텐츠 검색
"""
import httpx
from typing import Optional, List, Dict, Any
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)


class YouTubeService:
    """YouTube Data API 서비스"""
    
    def __init__(self):
        self.api_key = settings.YOUTUBE_API_KEY
        self.base_url = "https://www.googleapis.com/youtube/v3"
        self.client = httpx.AsyncClient()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    async def search_educational_videos(
        self,
        query: str,
        max_results: int = 10,
        order: str = "relevance",
        duration: str = "medium"  # short, medium, long
    ) -> Optional[List[Dict[str, Any]]]:
        """교육용 비디오 검색"""
        if not self.api_key:
            logger.warning("YouTube API key not configured")
            return None
        
        try:
            params = {
                "part": "snippet,statistics",
                "q": f"{query} tutorial education learning",
                "type": "video",
                "maxResults": max_results,
                "order": order,
                "videoDuration": duration,
                "videoCaption": "closedCaption",  # 자막이 있는 비디오 우선
                "videoLicense": "any",
                "safeSearch": "strict",
                "key": self.api_key
            }
            
            response = await self.client.get(
                f"{self.base_url}/search",
                params=params,
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                videos = []
                
                # 비디오 상세 정보 가져오기
                video_ids = [item["id"]["videoId"] for item in data.get("items", [])]
                detailed_videos = await self.get_videos_details(video_ids)
                
                for i, item in enumerate(data.get("items", [])):
                    video_info = {
                        "id": item["id"]["videoId"],
                        "title": item["snippet"]["title"],
                        "description": item["snippet"]["description"],
                        "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                        "channel_title": item["snippet"]["channelTitle"],
                        "published_at": item["snippet"]["publishedAt"],
                        "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
                    }
                    
                    # 상세 정보 추가
                    if detailed_videos and i < len(detailed_videos):
                        detail = detailed_videos[i]
                        video_info.update({
                            "duration": detail.get("duration"),
                            "view_count": detail.get("view_count"),
                            "like_count": detail.get("like_count"),
                            "comment_count": detail.get("comment_count")
                        })
                    
                    videos.append(video_info)
                
                return videos
            else:
                logger.error(f"YouTube API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error searching YouTube videos: {str(e)}")
            return None
    
    async def get_videos_details(self, video_ids: List[str]) -> Optional[List[Dict[str, Any]]]:
        """비디오 상세 정보 가져오기"""
        if not self.api_key or not video_ids:
            return None
        
        try:
            params = {
                "part": "contentDetails,statistics",
                "id": ",".join(video_ids),
                "key": self.api_key
            }
            
            response = await self.client.get(
                f"{self.base_url}/videos",
                params=params,
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                details = []
                
                for item in data.get("items", []):
                    detail = {
                        "duration": item["contentDetails"]["duration"],
                        "view_count": int(item["statistics"].get("viewCount", 0)),
                        "like_count": int(item["statistics"].get("likeCount", 0)),
                        "comment_count": int(item["statistics"].get("commentCount", 0))
                    }
                    details.append(detail)
                
                return details
            else:
                logger.error(f"YouTube API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting video details: {str(e)}")
            return None
    
    def parse_duration(self, duration: str) -> int:
        """YouTube 지속시간 형식을 초로 변환 (PT4M13S -> 253초)"""
        import re
        
        pattern = r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"
        match = re.match(pattern, duration)
        
        if not match:
            return 0
        
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        
        return hours * 3600 + minutes * 60 + seconds
    
    async def recommend_videos_for_topic(
        self,
        topic: str,
        skill_level: str = "beginner",
        max_results: int = 5
    ) -> Optional[List[Dict[str, Any]]]:
        """주제와 기술 수준에 맞는 비디오 추천"""
        # 기술 수준에 따른 검색 키워드 조정
        level_keywords = {
            "beginner": "basics introduction tutorial for beginners",
            "intermediate": "intermediate guide tutorial",
            "advanced": "advanced techniques deep dive",
            "expert": "expert advanced professional"
        }
        
        search_query = f"{topic} {level_keywords.get(skill_level, '')}"
        
        return await self.search_educational_videos(
            query=search_query,
            max_results=max_results,
            duration="medium"
        )


# 싱글톤 YouTube 서비스 인스턴스
youtube_service = YouTubeService()