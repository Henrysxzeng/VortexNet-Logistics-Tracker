# 🚚 VortexNet: Real-Time Logistics Tracking Platform

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![AWS DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socket.io&logoColor=white)

A distributed, microservices-based location tracking system that simulates real-time vehicle telematics, processes high-throughput geospatial data, and broadcasts live updates to a React-based dashboard. 

This project was built to demonstrate proficiency in **Event-Driven Architecture**, **Real-Time Data Streaming**, and **Cloud-Native Database Management**.

## ✨ Key Features

- **Microservices Architecture**: Strictly decoupled services with separated concerns (Data Layer, Mock Telematics, API Gateway, and UI).
- **Real-Time WebSockets**: Achieved sub-second data latency from IoT endpoints to the client dashboard using persistent WebSocket connections instead of traditional HTTP polling.
- **High-Concurrency Ready**: Designed around AWS DynamoDB (NoSQL) to handle massive, high-frequency trajectory logs without relational database locking overhead.
- **Dynamic Geospatial UI**: Utilizes `react-leaflet` with Next.js dynamic imports (SSR disabled) to render smooth, real-time vehicle movements across a map of the United States.

---

## 🏗️ System Architecture & Data Flow

The platform consists of four independent microservices:

1. **`vendor-data` (Infrastructure as Code & Database)**
   - Utilizes `aws-sdk` to programmatically provision the `vendors` table in AWS DynamoDB.
   - Responsible for seeding initial vendor profiles (e.g., Pacific Freight - CA) into the cloud.

2. **`vendor-simulator` (Mock IoT Telematics)**
   - Replaces physical GPS T-Boxes by running a continuous Node.js engine.
   - Applies a Random Walk algorithm to generate highly realistic, incremental GPS coordinate updates for multiple trucks every 3 seconds.
   - Pushes data to the API Gateway via HTTP POST.

3. **`vendor-api` (Gateway & WebSocket Hub)**
   - An Express.js server that exposes an `/ingest` endpoint for incoming telematics data.
   - Instantly multiplexes and broadcasts incoming payloads to all connected dashboard clients via WebSockets (`ws`).

4. **`vendor-ui` (Frontend Dashboard)**
   - A Next.js 14 application featuring a custom `useWebSocket` hook for robust connection management.
   - Renders a live-updating OpenStreetMap, translating raw geo-coordinates into moving DOM markers.

---

## 🛠️ Tech Stack

- **Backend / API**: Node.js, Express.js, `ws` (WebSockets), TypeScript
- **Frontend**: React 18, Next.js 14, Tailwind CSS, Leaflet (`react-leaflet`)
- **Database & Cloud**: Amazon Web Service (AWS) DynamoDB, AWS CLI
- **Tooling**: npm, `tsc` (TypeScript Compiler)

---

## 🚀 Getting Started (Local Development)

To run the full microservices cluster locally, you will need to start three separate terminal instances.

### Prerequisites
- Node.js (v20 LTS recommended)
- AWS CLI configured with valid IAM Access Keys (`aws configure`)
- Default AWS Region set to `us-east-1`

### 1. Start the API Gateway (Terminal 1)
This acts as the central hub. It must be running first to receive and broadcast data.
```bash
cd vendor-api
npm install
npx tsc
node build/index.js
# Runs on http://localhost:8080
```

### 2. Start the Telematics Simulator (Terminal 2)

This will start generating and pushing GPS coordinates to the API.

```bash
cd vendor-simulator
npm install
npx tsc
node build/index.js
# You should see logs indicating successful data ingestion to the API.
```

### 3. Start the Next.js Dashboard (Terminal 3)

Connect to the hub and visualize the data.

```bash
cd vendor-ui
npm install
npm run dev
# Open http://localhost:3000 in your browser.
```

(Note: The `vendor-data` service only needs to be executed once during initial setup to provision the AWS DynamoDB table. It does not need to run continuously.)