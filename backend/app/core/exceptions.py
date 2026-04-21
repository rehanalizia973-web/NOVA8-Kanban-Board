import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

log = logging.getLogger(__name__)


class DomainError(Exception):
    """Base for business-logic errors that the HTTP layer translates into status codes."""


class TaskNotFound(DomainError):
    def __init__(self, task_id: str) -> None:
        super().__init__(f"Task {task_id!r} not found")
        self.task_id = task_id


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(TaskNotFound)
    async def _task_not_found(_: Request, exc: TaskNotFound) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(Exception)
    async def _unhandled(_: Request, exc: Exception) -> JSONResponse:
        log.exception("Unhandled exception: %s", exc)
        return JSONResponse(
            status_code=500, content={"detail": "Internal server error"}
        )
