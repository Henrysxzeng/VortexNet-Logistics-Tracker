// src/index.ts
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';

// 1. 初始化 Express 应用
const app = express();
app.use(cors()); // 允许前端跨域访问
app.use(express.json()); // 允许解析传入的 JSON 数据

// 2. 将 Express 挂载到原生的 HTTP Server 上，因为 WebSocket 需要复用同一个端口
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ==========================================
// 📡 模块 A：WebSocket 广播站 (面向前端)
// ==========================================
wss.on('connection', (ws) => {
  console.log('🟢 [WebSocket] 新的前端大屏已连接！');

  ws.on('close', () => {
    console.log('🔴 [WebSocket] 前端大屏已断开连接。');
  });
});

// ==========================================
// 📥 模块 B：HTTP 接收接口 (面向模拟器/卡车)
// ==========================================
app.post('/ingest', (req, res) => {
  const locationData = req.body;
  
  // 打印收到的数据简报
  console.log(`📦 收到卡车数据: ${locationData.deviceId} 位于 [${locationData.geo.lat}, ${locationData.geo.long}]`);

  // 【核心魔法】：遍历所有连着天线的前端，把数据转成字符串扔给它们！
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(locationData));
    }
  });

  // 给模拟器回个话，表示收到了
  res.status(200).send({ message: 'Data received and broadcasted!' });
});

// 3. 启动服务器，监听 8080 端口
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 API 与 WebSocket 枢纽已启动！正在监听端口: ${PORT}`);
});