// src/components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // 极其重要：没有这行代码，地图会碎成一片一片的！
import { LocationData } from '../hooks/useWebSocket';

// 🎨 自定义一个圆形的卡车图标 (直接用 CSS 和 emoji，避免加载外部图片报错)
const createTruckIcon = () => {
  return L.divIcon({
    className: 'custom-truck-icon',
    html: `<div style="background-color: white; border: 2px solid #2a9d8f; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">🚚</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16], // 让图标的中心点对准真实的经纬度
  });
};

interface MapProps {
  trucks: Record<string, LocationData>;
}

const Map = ({ trucks }: MapProps) => {
  // 设置地图的初始中心点为美国中部 (经纬度：39.82, -98.57)
  const defaultCenter: [number, number] = [39.8283, -98.5795];

  return (
    // MapContainer 是整个地图的容器，必须有高度才能显示
    <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      {/* 免费且开源的 OpenStreetMap 瓦片底图 */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 遍历 WebSocket 传过来的卡车字典，为每一辆车画一个标记 */}
      {Object.values(trucks).map((truck) => (
        <Marker
          key={truck.deviceId}
          position={[truck.geo.lat, truck.geo.long]}
          icon={createTruckIcon()}
        >
          {/* 点击卡车图标弹出的详细信息框 */}
          <Popup>
            <div className="font-sans">
              <div className="font-bold text-lg text-teal-600 mb-1">{truck.deviceId}</div>
              <div className="text-sm text-gray-700">👤 Driver: {truck.driverName}</div>
              <div className="text-sm text-gray-700">🟢 Status: {truck.statusText}</div>
              <div className="text-xs text-gray-400 mt-2">
                Lat: {truck.geo.lat.toFixed(4)}, Lng: {truck.geo.long.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;