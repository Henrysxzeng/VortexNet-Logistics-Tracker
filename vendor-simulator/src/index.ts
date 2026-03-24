import { LocationLog } from './types';
import crypto from 'crypto';

const trucks = [
  { deviceId: 'TRUCK-CA-001', driverName: 'John Doe',avatarUrl: 'https://vortexnet-assets-zanki.s3.us-east-1.amazonaws.com/driver-001.jpg',  lat: 34.0522, long: -118.2437 },
  { deviceId: 'TRUCK-NY-002', driverName: 'Mike Smith', lat: 40.7128, long: -74.0060 },
  { deviceId: 'TRUCK-TX-003', driverName: 'Sarah Connor', lat: 29.7604, long: -95.3698 }
];

const getRandomOffset = () => (Math.random() - 0.5) * 0.004;

// 🆕 新增：负责把数据通过网络发给 API 基站的函数
const sendDataToApi = async (log: LocationLog) => {
  try {
    const response = await fetch('http://localhost:8080/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    });

    if (response.ok) {
      console.log(`[${log.timestamp}] ✈️ 成功发送 ${log.deviceId} 坐标 -> API 基站`);
    } else {
      console.error(`⚠️ 发送失败: API 基站返回状态码 ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ 发送失败！API 基站似乎没开，请检查 vendor-api 是否在 8080 端口运行。`);
  }
};

const simulateTraffic = () => {
  console.log('🚀 车辆轨迹模拟器已启动，开始向 API 基站实时推流...\n');

  setInterval(() => {
    trucks.forEach((truck) => {
      truck.lat += getRandomOffset();
      truck.long += getRandomOffset();

      const log: LocationLog = {
        deviceId: truck.deviceId,
        logId: crypto.randomUUID(),
        driverName: truck.driverName,
        statusText: 'Driving',
        avatarUrl: truck.avatarUrl,
        timestamp: new Date().toISOString(),
        geo: {
          lat: Number(truck.lat.toFixed(6)),
          long: Number(truck.long.toFixed(6)),
        }
      };

      // 💥 关键改变：不再只打印，而是直接发送网络请求！
      sendDataToApi(log);
    });
    console.log('---------------------------------------------------');
  }, 3000); 
};

simulateTraffic();