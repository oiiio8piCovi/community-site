"""
简易站内搜索接口
只针对标题、正文做关键词匹配，草案阶段不做搜索引擎
"""
from fastapi import APIRouter, Query
from mock_db import article_data
from utils import simple_keyword_filter

router = APIRouter(prefix="/api/search", tags=["站内搜索模块"])


@router.get("/query")
def search_api(keyword: str = Query(..., min_length=1)):
    """
    简易搜索接口
    根据关键词匹配文章标题、内容
    """
    result = []
    for item in article_data:
        title_match = simple_keyword_filter(item["title"], keyword)
        content_match = simple_keyword_filter(item["content"], keyword)
        if title_match or content_match:
            result.append(item)
    return {
        "keyword": keyword,
        "count": len(result),
        "data": result
    }
