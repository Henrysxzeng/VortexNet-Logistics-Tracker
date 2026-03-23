import { Vendor } from '../types/aws';

export const seedVendors: Vendor[] = [
  {
    deviceId: 'TRUCK-CA-001',
    name: 'Pacific Freight - CA',
    image: 'https://dummyimage.com/400x400/2a9d8f/fff&text=Pacific+Freight',
    description: 'West Coast heavy haulage fleet. Equipped with high-precision GPS and real-time telemetry.',
    locationHistory: [],
    created: Date.now(),
    updated: Date.now(),
  },
  {
    deviceId: 'TRUCK-NY-002',
    name: 'East Coast Transit - NY',
    image: 'https://dummyimage.com/400x400/e76f51/fff&text=East+Coast+Transit',
    description: 'Interstate logistics serving the Tri-State area. Optimized for urban and highway routes.',
    locationHistory: [],
    created: Date.now(),
    updated: Date.now(),
  },
  {
    deviceId: 'TRUCK-TX-003',
    name: 'Texas Haulage - TX',
    image: 'https://dummyimage.com/400x400/e9c46a/000&text=Texas+Haulage',
    description: 'Southern cross-border transport. Specialized in long-haul temperature-controlled freight.',
    locationHistory: [],
    created: Date.now(),
    updated: Date.now(),
  }
];