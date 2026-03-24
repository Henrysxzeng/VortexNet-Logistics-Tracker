// src/hooks/useWebSocket.ts
import { useState, useEffect } from 'react';

// 定义前端接收到的数据结构 (和后端一模一样)
export interface LocationData {
  deviceId: string;
  driverName: string;
  statusText: string;
  timestamp: string;
  avatarUrl?: string;
  geo: {
    lat: number;
    long: number;
  };
  aiRiskScore?: number;
  aiIsHighRisk?: boolean;
}

export const useWebSocket = (url: string) => {
  // 用一个字典 (Record) 来存储所有卡车的最新位置
  // 比如: { 'TRUCK-CA-001': { lat: 34.05, long: -118.24, ... } }
  const [trucks, setTrucks] = useState<Record<string, LocationData>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🔄 正在连接 WebSocket 基站...');
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('✅ 成功连接到 API 基站！');
      setIsConnected(true);
    };

    // 🌟 核心魔法：每当基站推过来一条新数据，就更新 React 状态
    ws.onmessage = (event) => {
      const newData: LocationData = JSON.parse(event.data);
      
      setTrucks((prevTrucks) => ({
        ...prevTrucks,
        [newData.deviceId]: newData, // 用设备的 ID 作为 key，覆盖它旧的位置
      }));
    };

    ws.onclose = () => {
      console.log('❌ 已断开与基站的连接');
      setIsConnected(false);
    };

    // 组件销毁时自动断开连接，防止内存泄漏
    return () => {
      ws.close();
    };
  }, [url]);

  return { trucks, isConnected };
};