"""
通用工具函数，业务无关的公共逻辑
"""
from datetime import datetime


def get_now_str() -> str:
    """获取格式化的当前时间字符串"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def simple_keyword_filter(text: str, keyword: str) -> bool:
    """简易文本关键词匹配，小写忽略大小写"""
    return keyword.lower() in text.lower()
