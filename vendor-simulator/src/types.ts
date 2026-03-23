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
  geo: Geotag;
}