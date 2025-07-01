"""
인증 API 라우터
Supabase Auth를 활용한 회원가입, 로그인, 로그아웃 등
"""
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from supabase import Client
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Supabase 클라이언트 초기화
from supabase import create_client

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(url, key)

router = APIRouter(prefix="/auth", tags=["인증"])
security = HTTPBearer()

# ============================================================================
# Pydantic 모델들
# ============================================================================

class SignUpRequest(BaseModel):
    """회원가입 요청"""
    email: EmailStr
    password: str
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class SignInRequest(BaseModel):
    """로그인 요청"""
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    """인증 응답"""
    access_token: str
    token_type: str = "Bearer"
    user: dict
    expires_in: int

class UserProfile(BaseModel):
    """사용자 프로필"""
    id: str
    email: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    created_at: str

# ============================================================================
# 의존성 함수들
# ============================================================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """현재 로그인된 사용자 정보 가져오기"""
    try:
        token = credentials.credentials
        
        # Supabase에서 토큰 검증
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 토큰입니다"
            )
        
        return user_response.user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"토큰 검증 실패: {str(e)}"
        )

# ============================================================================
# API 엔드포인트들
# ============================================================================

@router.post("/signup", response_model=AuthResponse, summary="회원가입")
async def sign_up(user_data: SignUpRequest):
    """
    새 사용자 회원가입
    
    - **email**: 이메일 주소 (필수)
    - **password**: 비밀번호 (필수) 
    - **username**: 사용자명 (필수)
    - **first_name**: 이름 (선택)
    - **last_name**: 성 (선택)
    """
    try:
        # Supabase Auth로 사용자 생성
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "username": user_data.username,
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="회원가입에 실패했습니다"
            )
        
        # 사용자 테이블에 추가 정보 저장
        user_profile = {
            "id": auth_response.user.id,
            "email": user_data.email,
            "username": user_data.username,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "full_name": f"{user_data.first_name or ''} {user_data.last_name or ''}".strip(),
            "is_active": True,
            "is_verified": False,
            "role": "student"
        }
        
        # users 테이블에 프로필 저장
        try:
            supabase.table("users").insert(user_profile).execute()
        except Exception as db_error:
            print(f"사용자 프로필 저장 실패: {db_error}")
            # Auth는 성공했으므로 계속 진행
        
        return AuthResponse(
            access_token=auth_response.session.access_token,
            user=auth_response.user.model_dump(),
            expires_in=auth_response.session.expires_in or 3600
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"회원가입 실패: {str(e)}"
        )

@router.post("/signin", response_model=AuthResponse, summary="로그인")
async def sign_in(user_data: SignInRequest):
    """
    사용자 로그인
    
    - **email**: 이메일 주소
    - **password**: 비밀번호
    """
    try:
        # Supabase Auth로 로그인
        auth_response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if not auth_response.user or not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="이메일 또는 비밀번호가 잘못되었습니다"
            )
        
        return AuthResponse(
            access_token=auth_response.session.access_token,
            user=auth_response.user.model_dump(),
            expires_in=auth_response.session.expires_in or 3600
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"로그인 실패: {str(e)}"
        )

@router.post("/signout", summary="로그아웃")
async def sign_out(current_user = Depends(get_current_user)):
    """
    사용자 로그아웃
    
    현재 세션을 종료합니다.
    """
    try:
        supabase.auth.sign_out()
        return {"message": "성공적으로 로그아웃되었습니다"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"로그아웃 실패: {str(e)}"
        )

@router.get("/me", response_model=UserProfile, summary="현재 사용자 정보")
async def get_me(current_user = Depends(get_current_user)):
    """
    현재 로그인된 사용자의 정보를 가져옵니다.
    """
    try:
        # 데이터베이스에서 추가 프로필 정보 가져오기
        user_profile = supabase.table("users").select("*").eq("id", current_user.id).execute()
        
        if user_profile.data:
            profile_data = user_profile.data[0]
            return UserProfile(
                id=profile_data["id"],
                email=profile_data["email"],
                username=profile_data.get("username"),
                first_name=profile_data.get("first_name"),
                last_name=profile_data.get("last_name"),
                created_at=profile_data["created_at"]
            )
        else:
            # 기본 Auth 정보만 반환
            return UserProfile(
                id=current_user.id,
                email=current_user.email,
                created_at=current_user.created_at
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"사용자 정보 조회 실패: {str(e)}"
        )

@router.get("/verify-token", summary="토큰 검증")
async def verify_token(current_user = Depends(get_current_user)):
    """
    현재 토큰이 유효한지 검증합니다.
    """
    return {
        "valid": True,
        "user_id": current_user.id,
        "email": current_user.email
    }

@router.post("/refresh", summary="토큰 갱신")
async def refresh_token():
    """
    액세스 토큰을 갱신합니다.
    """
    try:
        auth_response = supabase.auth.refresh_session()
        
        if not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="토큰 갱신에 실패했습니다"
            )
        
        return {
            "access_token": auth_response.session.access_token,
            "token_type": "Bearer",
            "expires_in": auth_response.session.expires_in or 3600
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"토큰 갱신 실패: {str(e)}"
        ) 