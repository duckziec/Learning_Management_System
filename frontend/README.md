# EduLearn Frontend

Frontend của Learning Management System, xây dựng bằng React 18, Vite, React Router, Axios và Vitest.

## Scripts

```powershell
npm install
npm run dev
npm run build
npm test
npm run test:coverage
npm run test:coverage:core
```

| Script | Mục đích |
|---|---|
| `npm run dev` | Chạy Vite dev server |
| `npm run build` | Build production |
| `npm test` | Chạy toàn bộ test frontend bằng Vitest |
| `npm run test:coverage` | Chạy coverage theo cấu hình chung |
| `npm run test:coverage:core` | Chạy coverage gọn cho core frontend logic, dùng cho báo cáo |

## Testing

Bộ test hiện tại:

```text
Test Files  19 passed (19)
Tests       146 passed (146)
```

Coverage core logic:

```text
Statements : 94.85%
Branches   : 82.58%
Functions  : 97.97%
Lines      : 96.73%
```

Các nhóm đã có test:

- Utilities và mappers: app error, assignment mapper, blog mapper, course order, course slug, date/time, formatter, quiz scoring.
- Auth và routing: `AuthContext`, `PrivateRoute`, `RoleRoute`.
- Services: `api.client` interceptor, `deviceInfo`, `oauthUtils`.
- Hooks: `useFileUpload`, `useJudge0`.
- UI dùng chung: `ToastProvider` và `useToast`.

Test chạy trong `jsdom`, mock axios/apiClient/fetch/storage/browser API nên không cần backend hoặc dịch vụ ngoài.

## Source Layout

```text
src/
  components/ui/        Shared UI components
  configurations/       Env and OAuth config
  constants/            API endpoints, roles, languages
  context/              AuthContext
  features/             Feature modules: auth, courses, assignment, blog, dashboard
  hooks/                Shared React hooks
  layouts/              Auth/Student/Instructor/Admin layouts
  routes/               AppRoutes, PrivateRoute, RoleRoute
  services/             API clients and browser/network services
  test/                 Vitest test suite
  utils/                Shared pure utilities and mappers
```

## Notes

- `test:coverage:core` intentionally focuses on core logic so the report is readable and not diluted by large page-level UI files.
- `ENDPOINTS.JUDGE0` is available for the `useJudge0` hook's submit/result polling flow.
- Frontend tests do not perform real login, upload, OAuth redirect, MinIO upload or Judge0 execution.
