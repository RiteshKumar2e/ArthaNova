"""ArthaNova — Request logging middleware."""

import time
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("arthanova.requests")


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response: Response = await call_next(request)
        process_time = (time.time() - start_time) * 1000

        logger.info(
            f"{request.method} {request.url.path} | "
            f"Status: {response.status_code} | "
            f"Time: {process_time:.2f}ms"
        )
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
        return response
