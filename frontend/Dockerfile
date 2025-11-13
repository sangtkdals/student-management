# 1단계: Node.js 환경에서 React 앱 빌드 (Builder Stage)
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 종속성 캐싱 활용
COPY package*.json ./

# 종속성 설치
RUN npm install --timeout=60000

# 나머지 소스 코드 복사
COPY . .

# 프로덕션용으로 앱 빌드
RUN npm run build


# 2단계: Nginx를 사용하여 빌드된 정적 파일 서비스 (Runtime Stage)
FROM nginx:stable-alpine

# 위에서 작성한 커스텀 Nginx 설정 파일을 이미지 안으로 복사
# 기존의 기본 설정을 덮어쓰게 됨
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Builder 스테이지에서 빌드된 결과물(dist 폴더)을 Nginx의 기본 웹 루트 폴더로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx가 80번 포트를 사용함을 명시
EXPOSE 80

# 컨테이너 시작 시 Nginx 실행
CMD ["nginx", "-g", "daemon off;"]