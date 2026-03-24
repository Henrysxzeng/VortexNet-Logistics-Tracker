// src/types.ts
export interface Geotag {
  lat: number;
  long: number;
}

export interface LocationLog {
  deviceId: string;
  logId: string;
  driverName: string;
  statusText: string;
  timestamp: string;
  avatarUrl?: string; // 🆕 新增这个字段，问号代表可选
  geo: Geotag;
}