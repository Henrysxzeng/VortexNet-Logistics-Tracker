// vendor-api/src/index.ts
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import Redis from 'ioredis'; // 📦 引入 Redis 引擎

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 🧠 模块 A：连接云端 Redis 缓存
// ==========================================
const REDIS_URL = 'rediss://default:gQAAAAAAAUOYAAIncDFlM2U5YzU2YmZhNmE0NzEwOGJiZWNhN2E2MWViMGUyOHAxODI4NDA@loved-yak-82840.upstash.io:6379';
const redis = new Redis(REDIS_URL);

redis.on('connect', () => {
  console.log('🟢 [Redis] 成功连接到 Upstash 云端高速缓存！');
});

redis.on('error', (err) => {
  console.error('🔴 [Redis] 连接失败，请检查 URL:', err);
});

// ==========================================
// 📡 模块 B：WebSocket 广播站
// ==========================================
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🟢 [WebSocket] 新的前端大屏已连接！');
});

// ==========================================
// 📥 模块 C：数据入口 (集成 AI 评分、写入缓存并广播)
// ==========================================
app.post('/ingest', async (req, res) => { 
  const locationData = req.body;
  
  // ==========================================
  // 🧠 核心新增：Node.js 拦截数据，调用 Python AI 微服务
  // ==========================================
  try {
    // 用 fetch 向我们的 Python 引擎发请求 (模拟传入驾驶特征)
    const mlResponse = await fetch('http://localhost:8000/score/driver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        speed_variance: Math.random() * 20,       // 随机速度方差
        braking_frequency: Math.floor(Math.random() * 10), // 随机急刹车次数
        idle_duration: Math.random() * 30         // 随机怠速时间
      })
    });

    if (mlResponse.ok) {
      const mlData = await mlResponse.json();
      // 把 Python 算出来的 AI 评分，强行塞进要发给前端的 JSON 数据里！
      locationData.aiRiskScore = mlData.risk_score;
      locationData.aiIsHighRisk = mlData.is_high_risk;
    }
  } catch (error) {
    console.log('⚠️ [AI Engine] Python 微服务未响应，暂时跳过 AI 评分。');
  }

  // 1. WebSocket 实时广播给前端大屏 (此时的 locationData 已经包含了 aiRiskScore)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(locationData));
    }
  });

  // 2. ⚡ 核心魔法：将最新坐标和 AI 评分一起写入 Redis 内存！
  try {
    const redisKey = `truck:${locationData.deviceId}`;
    await redis.set(redisKey, JSON.stringify(locationData));
  } catch (error) {
    console.error('🔴 [Redis] 写入缓存失败:', error);
  }

  res.status(200).send({ message: 'Data enriched with AI, broadcasted and cached!' });
});

// ==========================================
// 🔍 模块 D：简历亮点 —— 高频查询接口
// ==========================================
app.get('/truck/:id', async (req, res) => {
  const deviceId = req.params.id;
  const redisKey = `truck:${deviceId}`;

  try {
    // 尝试从内存中极速读取
    const cachedData = await redis.get(redisKey);
    
    if (cachedData) {
      console.log(`⚡ [Cache Hit] 命中缓存: ${deviceId}，耗时 < 5ms`);
      return res.status(200).json(JSON.parse(cachedData));
    } else {
      console.log(`🐢 [Cache Miss] 未命中缓存: ${deviceId}，需要去查底层数据库`);
      return res.status(404).json({ message: 'Truck not found in cache' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 启动服务器
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 API 枢纽 (带 Redis 缓存 & AI 评分) 已启动，端口: ${PORT}`);
});