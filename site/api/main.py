"""
后端服务主入口
社区站二期后端草案，FastAPI总调度
挂载所有业务路由、配置跨域、全局异常
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from routers import message_router, visit_router, search_router
import uvicorn

# 创建FastAPI实例
app = FastAPI(
    title="community-site 社区站后端API",
    description="社区站二期后端草案",
    version="0.1.0-draft"
)

# 跨域配置：前端静态页面访问后端接口必须开启
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载各个业务模块路由
app.include_router(message_router)
app.include_router(visit_router)
app.include_router(search_router)

@app.get("/api/health")
def health_check():
    """健康检测接口，给运维监控使用，判断后端是否存活"""
    return {"status": "ok", "project": "community-site-api", "version": "0.1.0-draft"}

# 全局异常统一返回格式
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "msg": exc.detail
        }
    )

if __name__ == "__main__":
    # 开发环境运行；部署上服务器后关闭reload
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=8010,
        reload=True
    )
