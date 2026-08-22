"""
内存存储，服务重启全部丢失；仅用于二期草案调试
三期迭代替换为SQLite/MySQL数据库
"""
from datetime import datetime
from typing import List, Dict

# ---------------------- 留言板数据表模拟 ----------------------
message_table: List[Dict] = []
message_id_auto = 1  # 留言自增ID

# ---------------------- 网站访问统计模拟 ----------------------
visit_stat: Dict = {
    "total_visit": 0,          # 全站总访问次数
    "today_visit": 0,          # 今日访问
    "last_reset_date": str(datetime.now().date())  # 今日重置标记
}

# ---------------------- 站内文章/资源模拟数据（用于搜索） ----------------------
article_data: List[Dict] = [
    {
        "id": 1,
        "title": "社区入门指南",
        "content": "欢迎来到社区站，这里可以交流学习、分享资源",
        "category": "guide",
        "create_time": str(datetime.now())
    }
]


def reset_today_visit():
    """重置今日访问计数，每日调用一次"""
    global visit_stat
    now_date = str(datetime.now().date())
    if visit_stat["last_reset_date"] != now_date:
        visit_stat["today_visit"] = 0
        visit_stat["last_reset_date"] = now_date


def get_new_message_id() -> int:
    """获取留言自增ID"""
    global message_id_auto
    new_id = message_id_auto
    message_id_auto += 1
    return new_id
