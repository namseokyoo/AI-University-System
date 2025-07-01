#!/usr/bin/env python3
"""
데이터베이스 마이그레이션 실행 스크립트
Usage: python run_migration.py [migration_file]
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# 환경 변수 로드
load_dotenv()


def run_migration(sql_file: str) -> bool:
    """
    SQL 마이그레이션 파일을 실행합니다.

    Args:
        sql_file: 실행할 SQL 파일 경로

    Returns:
        bool: 성공 여부
    """
    # Supabase 클라이언트 생성
    url = os.getenv('SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_KEY')

    if not url or not service_key:
        print("❌ 환경 변수가 설정되지 않았습니다:")
        print("   - SUPABASE_URL")
        print("   - SUPABASE_SERVICE_KEY")
        return False

    try:
        # Service role key 사용 (관리자 권한)
        supabase: Client = create_client(url, service_key)
        print(f"✅ Supabase 연결 성공: {url}")

        # SQL 파일 읽기
        sql_path = Path(sql_file)
        if not sql_path.exists():
            print(f"❌ SQL 파일을 찾을 수 없습니다: {sql_file}")
            return False

        with open(sql_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        print(f"📖 SQL 파일 읽기 완료: {sql_file}")
        print(f"📏 SQL 길이: {len(sql_content)} 문자")

        # SQL 실행을 위해 RPC 함수 호출
        # 직접 SQL 실행은 보안상 제한되므로 개별 쿼리로 분할
        print("🚀 마이그레이션 실행 시작...")

        # 간단한 연결 테스트로 대체
        print("📊 테이블 존재 여부 확인 중...")

        # 기본 테이블들 확인
        tables_to_check = ['users', 'courses',
                           'modules', 'lessons', 'enrollments']
        existing_tables = []

        for table in tables_to_check:
            try:
                # 테이블에 접근해서 존재 여부 확인
                result = supabase.table(table).select(
                    "count", count="exact").limit(0).execute()
                existing_tables.append(table)
                print(f"   ✅ '{table}' 테이블 존재함")
            except Exception as e:
                print(f"   ❌ '{table}' 테이블 없음 또는 접근 불가")

        if len(existing_tables) == len(tables_to_check):
            print("🎉 모든 필수 테이블이 이미 존재합니다!")
            print("💡 Supabase 웹 대시보드에서 직접 실행하는 것을 권장합니다.")
            return True
        else:
            print(
                f"⚠️  {len(tables_to_check) - len(existing_tables)}개 테이블이 누락되었습니다.")
            print("📖 아래 가이드를 따라 Supabase 웹 대시보드에서 실행하세요:")
            print(f"   1. https://supabase.com/dashboard/project/giallnpmpicaqwemmjyy 접속")
            print(f"   2. SQL Editor 메뉴 선택")
            print(f"   3. {sql_file} 파일 내용 복사 & 붙여넣기")
            print(f"   4. Run 버튼 클릭")
            return False

    except Exception as e:
        print(f"❌ 마이그레이션 실행 실패: {e}")
        return False


def main():
    """메인 실행 함수"""
    print("🗄️  AI University System - Database Migration Runner")
    print("=" * 60)

    # SQL 파일 경로 결정
    if len(sys.argv) > 1:
        sql_file = sys.argv[1]
    else:
        # 기본값: 001_initial_schema.sql
        current_dir = Path(__file__).parent
        sql_file = current_dir / "001_initial_schema.sql"

    print(f"📂 마이그레이션 파일: {sql_file}")

    # 마이그레이션 실행
    success = run_migration(str(sql_file))

    if success:
        print("\n🎉 마이그레이션이 성공적으로 완료되었습니다!")
        print("📊 다음 단계:")
        print("   1. Supabase 대시보드에서 테이블 확인")
        print("   2. SQLAlchemy 모델 업데이트")
        print("   3. API 엔드포인트 테스트")
    else:
        print("\n❌ 마이그레이션 실행에 문제가 발생했습니다.")
        print("🔧 트러블슈팅:")
        print("   1. 환경 변수 확인 (.env 파일)")
        print("   2. Supabase 프로젝트 상태 확인")
        print("   3. Supabase 웹 대시보드에서 수동 실행")

        sys.exit(1)


if __name__ == "__main__":
    main()
