"""
留言板业务API
接口列表：
GET  /api/message/list   获取留言列表
POST /api/message/add    新增留言
"""
from fastapi import APIRouter, HTTPException
from schemas import MessageCreate, MessageItem
from mock_db import message_table, get_new_message_id
from utils import get_now_str
from typing import List  # 修复：草案漏了这行（List[MessageItem] 会 NameError），Part2 细讲

router = APIRouter(prefix="/api/message", tags=["留言板模块"])

@router.get("/list", response_model=List[MessageItem])
def get_message_list(limit: int = 20):
    """
    获取留言列表
    :param limit: 返回最多多少条，默认20条，前端可以控制分页大小
    """
    # 倒序，最新留言放最前面
    sorted_list = sorted(message_table, key=lambda x: x["msg_id"], reverse=True)
    return sorted_list[:limit]

@router.post("/add", response_model=MessageItem)
def add_message(payload: MessageCreate):
    """提交一条新留言"""
    new_msg = {
        "msg_id": get_new_message_id(),
        "nickname": payload.nickname,
        "content": payload.content,
        "create_time": get_now_str()
    }
    message_table.append(new_msg)
    return new_msg
