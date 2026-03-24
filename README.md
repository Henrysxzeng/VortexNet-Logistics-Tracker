# 🚚 VortexNet: Real-Time Logistics Tracking Platform

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A distributed, Polyglot Microservices-based location tracking system that simulates real-time vehicle telematics, processes high-throughput geospatial data, performs AI-driven risk analysis, and broadcasts live updates to a React-based dashboard. 

This project was built to demonstrate proficiency in **Event-Driven Architecture**, **Real-Time Data Streaming**, **Cloud-Native Database Management**, and **DevOps Automation**.

## ✨ Key Features

- **Polyglot Microservices Architecture**: Strictly decoupled services with separated concerns spanning Node.js and Python.
- **Real-Time WebSockets**: Achieved sub-second data latency from IoT endpoints to the client dashboard using persistent WebSocket connections instead of traditional HTTP polling.
- **High-Concurrency Data Layer**: Designed around AWS DynamoDB (NoSQL) for massive trajectory logs and AWS S3 for object storage (driver metadata/avatars), eliminating relational DB locking overhead.
- **High-Performance Caching**: Deployed Redis (LRU Strategy) via Upstash to cache frequent route queries, slashing database read latency to under 5ms.
- **AI-Driven Analytics Engine**: Integrated a Python/FastAPI microservice utilizing `scikit-learn` (Random Forest & Linear Regression) to dynamically compute driver risk scores and ETA based on real-time telematics features.
- **DevOps & IaC**: Automated AWS infrastructure provisioning using Terraform and established a CI/CD pipeline via GitHub Actions for automated build and testing.

---

## 🏗️ System Architecture & Data Flow

The platform consists of five core components:

1. **`vendor-simulator` (Mock IoT Telematics | Node.js)**
   - Replaces physical GPS T-Boxes by running a continuous Node.js engine.
   - Generates realistic, incremental GPS updates and driving behaviors (speed variance, braking frequency) every 3 seconds.

2. **`vendor-api` (Gateway & WebSocket Hub | Node.js)**
   - Acts as the central nervous system. Ingests telematics data via HTTP POST.
   - Calls the Python ML service to enrich payload with AI risk scores.
   - Instantly multiplexes and broadcasts the enriched payload to clients via WebSockets (`ws`).
   - Writes the latest state to the Redis cache.

3. **`vendor-ml` (AI Analytics Engine | Python)**
   - A standalone FastAPI server hosting pre-trained `scikit-learn` models.
   - Exposes `/score/driver` and `/predict/eta` endpoints for real-time mathematical inference.

4. **`vendor-ui` (Frontend Dashboard | Next.js)**
   - A Next.js 14 application rendering a live-updating OpenStreetMap (`react-leaflet`).
   - Synchronizes raw geo-coordinates, AI Risk Scores, and AWS S3-hosted avatars into moving DOM markers.

5. **`vendor-infra` (Infrastructure as Code | Terraform)**
   - HCL configuration files to programmatically deploy and destroy AWS DynamoDB tables and S3 buckets.

---

## 🛠️ Tech Stack

- **Backend / API Gateway**: Node.js, Express.js, `ws` (WebSockets), TypeScript
- **AI / Machine Learning**: Python, FastAPI, Uvicorn, Scikit-learn, NumPy, Pandas
- **Frontend**: React 18, Next.js 14, Tailwind CSS, Leaflet (`react-leaflet`)
- **Database & Cache**: AWS DynamoDB, AWS S3, Redis (Upstash)
- **DevOps & CI/CD**: Terraform, GitHub Actions, AWS CLI

---

## 🚀 Getting Started (Local Development)

To run the full Polyglot cluster locally, you will need to start four separate terminal instances.

### Prerequisites
- Node.js (v20 LTS recommended)
- Python 3.9+
- AWS CLI configured with valid IAM Access Keys
- Redis connection URL (Upstash recommended)

### 1. Start the AI Analytics Engine (Terminal 1)
```bash
cd vendor-ml
python -m venv venv
# Activate venv (Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Access Swagger UI at http://localhost:8000/docs
```

### 2. Start the API Gateway (Terminal 2)

```bash
cd vendor-api
npm install
npx tsc
node build/index.js
# Runs on http://localhost:8080
```

### 3. Start the Telematics Simulator (Terminal 3)

```bash
cd vendor-simulator
npm install
npx tsc
node build/index.js
```

### 4. Start the Next.js Dashboard (Terminal 4)

```bash
cd vendor-ui
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

*(Note: Use `cd vendor-infra` and run `terraform apply` to provision the cloud resources prior to starting the application.)*