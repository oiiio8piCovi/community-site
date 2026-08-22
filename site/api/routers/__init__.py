"""路由包初始化，统一导出路由对象，main.py直接导入"""
from .message import router as message_router
from .visit import router as visit_router
from .search import router as search_router

__all__ = ["message_router", "visit_router", "search_router"]
