export enum AWSRegions {
  US_EAST_1 = 'us-east-1',
}

// 地理位置坐标 (保持不变)
export interface Geotag {
  id: string;
  name: string;
  place_type: string;
  full_name: string;
  country: string;
  country_code: string;
  coordinates: {
    lat: number;
    long: number;
  };
}

// 【重构 1】从 Tweet (推文) 变成了 LocationLog (位置日志)
export interface LocationLog {
  deviceId: string; // 关联车载设备的唯一 ID
  logId: string;    // 这条位置记录的流水号
  driverName: string;
  statusText: string; // 车辆状态，比如 "行驶中", "静止", "异常"
  timestamp: string;  // 上报时间
  geo: Geotag;
}

// 【重构 2】Vendor 表的关联键不再是 twitterId，而是专业的 deviceId
export interface Vendor {
  name: string;
  image: string;
  description: string;
  deviceId: string;           // DynamoDB 的主键 (Partition Key)
  locationHistory: LocationLog[]; // 历史轨迹流
  created: number;
  updated: number;
}