"""FastAPI application entry point for the University Course Registration System.

The default Swagger UI is served at /docs but is protected behind an admin
login. A middleware checks the admin_token cookie (set after login on the
/admin-login page); without it, requests to /docs or /openapi.json are
redirected to the login page. The API docs themselves keep the standard,
default Swagger appearance.
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt

from exceptions.custom_exceptions import CourseSelectionException
from routers.access import router as access_router
from routers.auth import router as auth_router
from routers.courses import router as courses_router
from routers.professors import router as professors_router
from routers.selection import router as selection_router
from routers.students import router as students_router
from services.auth_services import ALGORITHM, SECRET_KEY, require_role
from storage import storage

# Directory of the built frontend (produced by the multi-stage Docker build).
# In local dev this may not exist, in which case Vite dev server is used.
FRONTEND_DIST = Path(__file__).resolve().parent / "frontend" / "dist"

# Backend API path prefixes (used to keep API 404s as JSON, not SPA HTML).
_API_PREFIXES = (
    "/students",
    "/professors",
    "/courses",
    "/selection",
    "/auth",
    "/access",
    "/summary",
    "/all-data",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/admin-login",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    storage.load_all()  # load on startup
    yield
    storage.save_all()  # save on shutdown


# Keep the DEFAULT Swagger UI look, but protect it behind admin login.
app = FastAPI(
    title="University Course Registration",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
    openapi_url="/openapi.json",
)

# CORS: allow the configured frontend origin(s) and any local-network host
# (so a phone on the same WiFi can call the API). Comma-separated FRONTEND_ORIGIN.
_origins = [o.strip() for o in os.getenv("FRONTEND_ORIGIN", "").split(",") if o.strip()]
if not _origins:
    _origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _is_admin_token(token: str) -> bool:
    """Return True if the token is a valid admin JWT."""
    if not token:
        return False
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return False
    return payload.get("role") == "admin"


class AdminDocsMiddleware:
    """Redirect unauthenticated requests away from the API docs."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        path = scope.get("path", "")
        protected = path in ("/docs", "/openapi.json", "/redoc")
        if protected:
            # Read cookies from the request headers.
            headers = dict(scope.get("headers", []))
            cookie_header = headers.get(b"cookie", b"").decode()
            token = None
            for part in cookie_header.split(";"):
                part = part.strip()
                if part.startswith("admin_token="):
                    token = part[len("admin_token="):]
                    break
            if not _is_admin_token(token):
                # Redirect to the login page.
                response = RedirectResponse("/admin-login", status_code=302)
                await response(scope, receive, send)
                return
        await self.app(scope, receive, send)


app.add_middleware(AdminDocsMiddleware)

# Include all routers
app.include_router(students_router)
app.include_router(professors_router)
app.include_router(courses_router)
app.include_router(selection_router)
app.include_router(auth_router)
app.include_router(access_router)


# Root: serve the frontend when it has been built; otherwise a welcome JSON.
@app.get("/", include_in_schema=False)
def root():
    if FRONTEND_DIST.exists():
        return FileResponse(FRONTEND_DIST / "index.html")
    return {"message": "Welcome to the University Course Registration System"}


# Health check — Railway/Cloudflare can probe this to confirm the app is up.
@app.get("/health", include_in_schema=False)
def health():
    return {"status": "ok"}


# Summary stats endpoint — admin only.
@app.get("/summary")
def summary(current_user: dict = Depends(require_role("admin"))):
    return {
        "total_students": len(storage.students),
        "total_professors": len(storage.professors),
        "total_courses": len(storage.courses),
    }


# Full data listing endpoint — admin only.
@app.get("/all-data")
def all_data(current_user: dict = Depends(require_role("admin"))):
    return {
        "students": [s.to_dict() for s in storage.students.values()],
        "professors": [p.to_dict() for p in storage.professors.values()],
        "courses": [c.to_dict() for c in storage.courses.values()],
    }


# Minimal admin login page that sets the admin_token cookie.
@app.get("/admin-login", include_in_schema=False)
def admin_login():
    html = """<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ورود ادمین</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(120deg, #1E3A5F, #2C5A8C, #C9A227);
      padding: 20px;
    }
    .card {
      background: #fff; border-radius: 16px; padding: 36px 32px; width: 100%; max-width: 380px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;
    }
    h1 { color: #1E3A5F; font-size: 22px; margin-bottom: 4px; }
    p.sub { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
    input {
      width: 100%; padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 10px;
      margin-bottom: 14px; font-size: 14px; outline: none;
    }
    input:focus { border-color: #1E3A5F; }
    button {
      width: 100%; padding: 12px; border: none; border-radius: 10px; background: #1E3A5F;
      color: #fff; font-size: 15px; font-weight: 700; cursor: pointer;
    }
    button:hover { background: #2C5A8C; }
    #error { color: #dc2626; font-size: 13px; margin-top: 12px; min-height: 18px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>پنل مدیریت سامانه</h1>
    <p class="sub">برای مشاهده مستندات API وارد شوید</p>
    <form id="login-form">
      <input id="username" name="username" autocomplete="off" placeholder="نام کاربری" />
      <input id="password" name="password" type="password" autocomplete="current-password" placeholder="رمز عبور" />
      <button type="submit" id="submit-btn">ورود</button>
    </form>
    <div id="error"></div>
  </div>
  <script>
    document.getElementById('login-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var err = document.getElementById('error');
      err.textContent = '';
      var btn = document.getElementById('submit-btn');
      btn.disabled = true;
      btn.textContent = 'در حال ورود…';
      try {
        var res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'admin',
            identifier: document.getElementById('username').value.trim(),
            secondary: document.getElementById('password').value
          })
        });
        if (!res.ok) {
          err.textContent = 'نام کاربری یا رمز عبور اشتباه است';
          btn.disabled = false; btn.textContent = 'ورود';
          return;
        }
        var data = await res.json();
        document.cookie = 'admin_token=' + encodeURIComponent(data.access_token) +
          '; path=/; max-age=7200; SameSite=Lax';
        window.location.href = '/docs';
      } catch (ex) {
        err.textContent = 'خطا در ارتباط با سرور';
        btn.disabled = false; btn.textContent = 'ورود';
      }
    });
  </script>
</body>
</html>
"""
    return HTMLResponse(content=html)


# Global exception handler for CourseSelectionException
@app.exception_handler(CourseSelectionException)
async def course_selection_exception_handler(request: Request, exc: CourseSelectionException):
    return JSONResponse(status_code=400, content={"detail": exc.message})


# ---- Serve the built frontend (single-origin, one process, one port) ----
# Only active when frontend/dist exists (production / Railway / Docker).
if FRONTEND_DIST.exists():
    # Static asset directories from the Vite build.
    for sub in ("assets", "images", "fonts"):
        _dir = FRONTEND_DIST / sub
        if _dir.is_dir():
            app.mount(f"/{sub}", StaticFiles(directory=_dir), name=f"frontend_{sub}")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa_fallback(full_path: str):
        """Serve static files and SPA fallback (index.html) for client routes."""
        candidate = FRONTEND_DIST / full_path
        if candidate.is_file():
            return FileResponse(candidate)
        # Unknown API paths should stay JSON 404s, not return the SPA HTML.
        if full_path and ("/" + full_path.split("/")[0]) in _API_PREFIXES:
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        return FileResponse(FRONTEND_DIST / "index.html")
