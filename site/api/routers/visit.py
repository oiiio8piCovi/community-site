"""
网站访问计数接口
GET /api/visit/count 访问统计，每次调用总访问+1
"""
from fastapi import APIRouter
from schemas import VisitStatResp
from mock_db import visit_stat, reset_today_visit

router = APIRouter(prefix="/api/visit", tags=["访问统计模块"])


@router.get("/count", response_model=VisitStatResp)
def site_visit_count():
    """
    网站访问统计接口
    前端页面加载时请求此接口，实现访问计数
    """
    reset_today_visit()  # 判断是否跨天，重置今日访问
    visit_stat["total_visit"] += 1
    visit_stat["today_visit"] += 1
    return VisitStatResp(
        total_visit=visit_stat["total_visit"],
        today_visit=visit_stat["today_visit"]
    )
