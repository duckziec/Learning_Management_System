src/features/
│
├── aboutus/
│   ├── components/          ← (chờ bổ sung)
│   └── pages/
│       └── AboutUsPage.jsx
│
├── auth/
│   ├── components/
│   │   ├── LoginForm.jsx       ← form đăng nhập có validation
│   │   ├── RegisterForm.jsx    ← form đăng ký có kiểm tra mật khẩu
│   │   └── ProfileCard.jsx     ← hiển thị avatar, role badge
│   └── pages/
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       └── ProfilePage.jsx
│
├── courses/
│   ├── components/
│   │   ├── CourseCard.jsx      ← card thumbnail, level badge
│   │   ├── LessonTree.jsx      ← tree-view có collapsible sections
│   │   └── CourseFilter.jsx    ← search + filter theo level
│   └── pages/
│       ├── CoursesPage.jsx
│       └── CourseDetailPage.jsx
│
├── assignment/
│   ├── code-judge/
│   │   ├── components/
│   │   │   ├── LanguageSelector.jsx  ← dropdown 47 ngôn ngữ Judge0
│   │   │   ├── TestcasePanel.jsx     ← collapsible input/expected/actual
│   │   │   └── SubmissionLog.jsx     ← log màu sắc theo từng trạng thái
│   │   └── pages/
│   │       └── CodeJudgePage.jsx
│   └── quiz/
│       ├── components/
│       │   ├── QuizTimer.jsx         ← đếm ngược, cảnh báo 60 giây cuối
│       │   └── QuestionCard.jsx      ← single/multiple choice
│       └── pages/
│           └── QuizPage.jsx
│
├── blog/
│   ├── components/
│   │   ├── PostCard.jsx        ← upvote/downvote/comment count
│   │   ├── CommentSection.jsx  ← form + danh sách comment
│   │   └── VoteBar.jsx         ← upvote/downvote với active state
│   └── pages/
│       ├── BlogListPage.jsx
│       └── BlogDetailPage.jsx
│
└── management/
    ├── course-management/
    │   ├── components/
    │   │   ├── DataTable.jsx       ← bảng chung với custom renderers
    │   │   └── CourseForm.jsx      ← form tạo/sửa khóa học
    │   └── pages/
    │       └── CourseManagementPage.jsx
    ├── assignment-management/
    │   ├── components/             ← (chờ bổ sung)
    │   └── pages/
    │       └── AssignmentManagementPage.jsx
    └── user-management/
        ├── components/
        │   └── UserTable.jsx       ← đổi role inline, khóa/kích hoạt tài khoản
        └── pages/
            └── UserManagementPage.jsx


edulearn-frontend/
├── public/
│   └── fonts/
├── src/
│   ├── App.jsx                          ← Root app wiring AppRoutes
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/
│   │   ├── ui/                          ← Button, Badge, Card (Atomic Design)
│   │   ├── media/                       ← React Player, PDF, Slide Viewer
│   │   ├── editor/                      ← Monaco Editor
│   │   └── common/                      ← Navbar, Sidebar, Footer
│   ├── constants/
│   │   ├── endpoints.js                 ← Gateway URLs đầy đủ cho mọi service
│   │   ├── roles.js                     ← ADMIN/INSTRUCTOR/STUDENT + permission matrix
│   │   └── languages.js                 ← 47 ngôn ngữ Judge0 (có thể mở rộng)
│   ├── features/
│   │   ├── aboutus/AboutUs.jsx
│   │   ├── auth/                        ← Login, Register, Profile
│   │   ├── courses/                     ← Courses, CourseDetail
│   │   ├── assignment/
│   │   │   ├── code-judge/CodeJudge.jsx
│   │   │   └── quiz/Quiz.jsx
│   │   ├── blog/                        ← BlogList, BlogDetail
│   │   └── management/
│   │       ├── course-management/
│   │       ├── assignment-management/
│   │       └── user-management/
│   ├── hooks/
│   │   ├── useAuth.js                   ← JWT + RBAC (hasRole, isAdmin...)
│   │   ├── useFileUpload.js             ← MinIO presigned URL upload
│   │   └── useJudge0.js                 ← Submit code + polling result
│   ├── services/
│   │   ├── api.client.js                ← Axios + auto token refresh interceptor
│   │   ├── identity.api.js
│   │   ├── course.api.js
│   │   ├── assignment.api.js
│   │   └── blog.api.js
│   ├── layouts/
│   │   ├── AuthLayout/AuthLayout.jsx
│   │   ├── StudentLayout/StudentLayout.jsx
│   │   ├── InstructorLayout/InstructorLayout.jsx
│   │   └── AdminLayout/AdminLayout.jsx
│   └── routes/
│       ├── AppRoutes.js                 ← Lazy-load + route groups theo role
│       ├── PrivateRoute.js              ← Yêu cầu đăng nhập
│       ├── RoleRoute.js                 ← Kiểm soát truy cập theo role
│       └── FallbackRoute.js             ← Redirect theo role sau login
└── README.md
