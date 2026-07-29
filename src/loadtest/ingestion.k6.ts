import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    ingestion_ramp: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 500,
      stages: [
  { target: 300, duration: '10s' },
  { target: 300, duration: '15s' },
  { target: 0, duration: '5s' },
],
    },
  },
};

function randomVehicleId() {
  return `vehicle-${Math.floor(Math.random() * 500)}`;
}

export default function () {
  const payload = JSON.stringify({
    vehicleId: randomVehicleId(),
    lat: 22.5 + Math.random() * 0.5,
    lng: 88.3 + Math.random() * 0.5,
    speed: Math.random() * 80,
    heading: Math.random() * 360,
  });

  const res = http.post('http://localhost:3000/api/telemetry/ingest', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, { 'status is 200': (r) => r.status === 200 });
}