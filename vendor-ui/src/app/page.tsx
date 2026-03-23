// src/app/page.tsx
'use client'; // 告诉 Next.js 这是一个客户端组件，可以使用 React Hooks

import dynamic from 'next/dynamic';
import { useWebSocket } from '../hooks/useWebSocket';

// 🌟 核心魔法：动态加载 Map 组件，并彻底禁用 SSR (服务端渲染)
// 这样就能完美解决 Leaflet "window is not defined" 的报错！
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-50 text-gray-500">
      🗺️ 正在加载高精度地图...
    </div>
  )
});

export default function Home() {
  // 拨通我们之前建好的 API 基站的 WebSocket 专线
  const { trucks, isConnected } = useWebSocket('ws://localhost:8080');

  return (
    // Tailwind CSS 布局：满宽满高，纵向排列
    <main className="flex flex-col h-screen w-screen bg-gray-100 overflow-hidden">
      
      {/* 顶部导航栏 / 仪表盘 */}
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-xl font-bold tracking-wider">
          🚚 VortexNet Logistics Tracker
        </h1>
        
        {/* 实时连接状态指示器 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">Gateway Status:</span>
          {isConnected ? (
            <span className="px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full animate-pulse">
              LIVE CONNECTED
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              DISCONNECTED
            </span>
          )}
        </div>
      </header>

      {/* 地图区域：占据剩下的所有空间 */}
      <div className="flex-1 relative z-0">
        <Map trucks={trucks} />
      </div>

    </main>
  );
}