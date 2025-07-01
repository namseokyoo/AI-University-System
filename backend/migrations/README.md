# 🗄️ **Database Migrations**

AI University System의 데이터베이스 마이그레이션 파일들입니다.

## 📋 **마이그레이션 목록**

### `001_initial_schema.sql`
- **목적**: 초기 데이터베이스 스키마 생성
- **포함 테이블**: users, courses, modules, lessons, enrollments
- **추가 기능**: 인덱스, 트리거, 제약조건, 샘플 데이터

## 🚀 **실행 방법**

### **방법 1: Supabase 웹 대시보드 (권장)**

1. **Supabase 대시보드 접속**
   ```
   https://supabase.com/dashboard/project/giallnpmpicaqwemmjyy
   ```

2. **SQL Editor 이동**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭

3. **스키마 실행**
   - `001_initial_schema.sql` 파일 내용을 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭

4. **실행 결과 확인**
   - 성공 메시지와 테이블 생성 확인
   - "Table Editor"에서 생성된 테이블들 확인

### **방법 2: 커맨드라인 (고급 사용자)**

```bash
# PostgreSQL 클라이언트로 직접 연결
psql "postgresql://postgres:[YOUR-PASSWORD]@db.giallnpmpicaqwemmjyy.supabase.co:5432/postgres" -f 001_initial_schema.sql
```

## ✅ **실행 후 확인사항**

### **생성된 테이블 확인**
- [ ] `users` - 사용자 정보
- [ ] `courses` - 코스 정보  
- [ ] `modules` - 코스 내 모듈
- [ ] `lessons` - 개별 레슨
- [ ] `enrollments` - 수강 신청 및 진도

### **인덱스 확인**
- [ ] 이메일, 사용자명 고유 인덱스
- [ ] 코스 슬러그 고유 인덱스
- [ ] 외래키 관계 인덱스

### **샘플 데이터 확인**
- [ ] 관리자 계정 생성 확인 (`admin@ai-university.com`)

## 🔧 **트러블슈팅**

### **권한 오류**
```sql
-- RLS 정책 비활성화 (개발 환경)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
-- 나머지 테이블들도 동일하게 적용
```

### **스키마 재생성**
```sql
-- 모든 테이블 삭제 후 재생성
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 그 후 001_initial_schema.sql 재실행
```

## 📊 **다음 단계**

1. ✅ 스키마 실행 완료
2. 🔄 SQLAlchemy 모델 업데이트
3. 🧪 API 엔드포인트 테스트
4. 🔐 인증 시스템 구현 