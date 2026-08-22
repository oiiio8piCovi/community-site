"""Pydantic模型，统一接口入参、出参格式，自动参数校验
前端传错参数会直接返回错误，不用手写大量if判断
"""
from pydantic import BaseModel, Field
from typing import Optional, List


# ---------- 留言板相关模型 ----------
class MessageCreate(BaseModel):
    """前端提交留言 请求体模型"""
    nickname: str = Field(min_length=1, max_length=20, description="留言昵称")
    content: str = Field(min_length=1, max_length=500, description="留言内容")


class MessageItem(BaseModel):
    """返回给前端的单条留言数据模型"""
    msg_id: int
    nickname: str
    content: str
    create_time: str


# ---------- 访问统计返回模型 ----------
class VisitStatResp(BaseModel):
    total_visit: int
    today_visit: str


# ---------- 搜索请求模型 ----------
class SearchQuery(BaseModel):
    keyword: str = Field(min_length=1, max_length=50, description="搜索关键词")
