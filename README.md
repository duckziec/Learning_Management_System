# EduLearn LMS

EduLearn LMS là hệ thống quản lý học tập hỗ trợ ba nhóm người dùng chính:
`STUDENT`, `INSTRUCTOR` và `ADMIN`.

Hệ thống cho phép học viên đăng ký khóa học, học bài, làm quiz, giải bài lập
trình, theo dõi tiến độ và tương tác qua blog. Giảng viên có thể tạo khóa học,
quản lý nội dung học tập, tạo bài kiểm tra, bài lập trình và theo dõi kết quả
học viên. Quản trị viên có thể quản lý người dùng, khóa học, blog, nội dung hệ
thống và trạng thái các service.

Truy cập: https://lmsystem.cloud để trải nghiệm ngay!

## Kiến Trúc Hệ Thống

Project được tổ chức theo mô hình monorepo:

```text
Learning-Management-System/
├── backend/     # Spring Boot microservices
├── frontend/    # Vite + React app
├── docker/      # Docker init/config files
├── docker-compose.yml
```

### Backend

Backend sử dụng kiến trúc microservices với Spring Boot:

| Service | Port | Vai trò |
|---|---:|---|
| `service-registry` | `8761` | Eureka service discovery |
| `api-gateway` | `8080` | Cổng vào hệ thống, route API, kiểm tra JWT |
| `identity-service` | `8081` | Đăng nhập, đăng ký, user, role, token |
| `course-service` | `8082` | Khóa học, bài học, đăng ký học, tiến độ |
| `assignment-service` | `8083` | Quiz, bài lập trình, submission, chấm code |
| `blog-service` | `8084` | Bài viết, bình luận, vote, tag |
| `chatbot-service` | `8085` | Chatbot học tập và hỗ trợ sinh quiz/test case |

Tất cả request từ frontend đi qua `api-gateway` tại:

```text
http://localhost:8080
```

Gateway dùng các prefix chính:

```text
/api/identity/**
/api/course/**
/api/assignment/**
/api/blog/**
/api/chatbot/**
```

### Frontend

Frontend sử dụng Vite + React 18, đặt trong thư mục `frontend/`.

Các phần chính:

- `src/routes`: định nghĩa route và phân quyền theo role.
- `src/context`: quản lý auth state.
- `src/services`: gọi API qua Axios.
- `src/features`: chia chức năng theo domain như auth, courses, assignment,
  dashboard, blog, settings.
- `src/layouts`: layout cho student, instructor, admin.

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

### Database Và Hạ Tầng

Khi chạy bằng Docker Compose, hệ thống dùng:

- MySQL: dữ liệu quan hệ cho identity, course, assignment, blog.
- MongoDB: dữ liệu document cho course, assignment, chatbot.
- Redis: cache, rate limit, hỗ trợ session/queue.
- MinIO: lưu file, ảnh, tài nguyên upload.
- Nginx: serve frontend production build.

## Công Nghệ Chính

### Backend

- Java 21
- Spring Boot 3.3.5
- Spring Cloud Gateway
- Eureka Discovery
- OpenFeign
- Spring Security
- Spring Data JPA
- Spring Data MongoDB
- Redis
- Flyway
- MySQL
- MongoDB
- MinIO
- Maven

### Frontend

- React 18
- Vite 5
- React Router
- Axios
- CodeMirror
- Framer Motion

### DevOps

- Docker
- Docker Compose
- Nginx

## Cách Chạy Project

### 1. Chạy Bằng Docker Compose

Đây là cách đơn giản nhất để chạy toàn bộ hệ thống local.

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Build và chạy toàn bộ service:

```bash
docker compose up --build
```

Sau khi chạy xong:

- Frontend: `http://localhost:5173`
- API Gateway: `http://localhost:8080`
- Eureka: `http://localhost:8761`
- MinIO Console: `http://localhost:9001`

Dừng hệ thống:

```bash
docker compose down
```

Nếu muốn xóa cả volume local:

```bash
docker compose down -v
```

### 2. Chạy Backend Thủ Công

Cần chuẩn bị trước:

- Java 21
- Maven
- MySQL
- MongoDB
- Redis
- MinIO

Build backend:

```bash
mvn clean install -f backend/pom.xml
```

Khởi động các service theo thứ tự:

```bash
mvn spring-boot:run -f backend/pom.xml -pl service-registry
mvn spring-boot:run -f backend/pom.xml -pl api-gateway
mvn spring-boot:run -f backend/pom.xml -pl identity-service
mvn spring-boot:run -f backend/pom.xml -pl course-service
mvn spring-boot:run -f backend/pom.xml -pl assignment-service
mvn spring-boot:run -f backend/pom.xml -pl blog-service
mvn spring-boot:run -f backend/pom.xml -pl chatbot-service
```

Build một service riêng:

```bash
mvn clean install -f backend/pom.xml -pl <module-name> -am
```

Ví dụ:

```bash
mvn clean install -f backend/pom.xml -pl assignment-service -am
```

### 3. Chạy Frontend Thủ Công

```bash
cd frontend
npm install
npm run dev
```

Build frontend production:

```bash
npm run build
```

Frontend gọi API thông qua biến môi trường:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Nếu cần cấu hình frontend riêng, tạo file:

```bash
cd frontend
cp .env.example .env
```