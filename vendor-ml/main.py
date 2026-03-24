# vendor-ml/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression

# 1. 初始化极速 Web 框架 FastAPI
app = FastAPI(title="VortexNet AI Engine")

# 允许跨域请求，方便我们的 Node.js 网关或前端调用
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 准备两个全局模型变量
eta_model = LinearRegression()
risk_model = RandomForestClassifier(n_estimators=100, random_state=42)

# ==========================================
# 🚀 模块 A：应用启动时，自动训练模型
# ==========================================
@app.on_event("startup")
def train_mock_models():
    print("🧠 正在初始化机器学习引擎并加载模型...")
    
    # 1. ETA 预测模型 (线性回归)
    # 特征 (X): [行驶距离(km), 拥堵指数(1-10)] -> 目标 (y): 预计耗时(分钟)
    X_eta = np.array([[10, 2], [50, 8], [20, 5], [100, 3], [5, 9]])
    y_eta = np.array([15, 90, 35, 110, 25])
    eta_model.fit(X_eta, y_eta)

    # 2. 驾驶员行为评分模型 (随机森林)
    # 这就是你简历里写的特征工程！
    # 特征 (X): [速度方差, 刹车频率, 怠速时长] -> 目标 (y): 0(安全) 或 1(高风险)
    X_risk = np.array([[5.2, 2, 10], [15.5, 12, 45], [2.1, 1, 5], [20.3, 15, 60], [8.5, 4, 15]])
    y_risk = np.array([0, 1, 0, 1, 0])
    risk_model.fit(X_risk, y_risk)
    
    print("✅ AI 模型加载完毕！随时可以进行推理预测。")

# ==========================================
# 📦 模块 B：定义数据契约 (类似于 TypeScript 的 Interface)
# ==========================================
class ETARequest(BaseModel):
    distance_km: float
    traffic_index: int

class RiskRequest(BaseModel):
    speed_variance: float
    braking_frequency: int
    idle_duration: float

# ==========================================
# 📡 模块 C：向外暴露的预测 API 接口
# ==========================================
@app.post("/predict/eta")
def predict_eta(req: ETARequest):
    # 将收到的 JSON 数据转换为 NumPy 数组喂给模型
    features = np.array([[req.distance_km, req.traffic_index]])
    predicted_mins = eta_model.predict(features)[0]
    
    return {"eta_minutes": round(predicted_mins, 1)}

@app.post("/score/driver")
def score_driver(req: RiskRequest):
    features = np.array([[req.speed_variance, req.braking_frequency, req.idle_duration]])
    
    # 获取属于分类 1 (高风险) 的概率概率，作为行为评分
    risk_prob = risk_model.predict_proba(features)[0][1] 
    risk_label = int(risk_model.predict(features)[0])
    
    return {
        "is_high_risk": bool(risk_label),
        "risk_score": round(risk_prob * 100, 2) # 转换为 0-100 的百分制评分
    }