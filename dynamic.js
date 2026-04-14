import { check, sleep } from 'k6';
import http from 'k6/http';

const apiUrl = 'https://zenlabs-betguard.onrender.com';
const averageResponseTime = 1000; // milliseconds
const thinkTime = 10; // seconds
const totalUsers = 25;

const activeUsers = totalUsers * 0.25; // 25% of total users active at any time
const totalVUs = activeUsers * (averageResponseTime / thinkTime);
const errorThreshold = 1 / 100; // 1% error rate

export const options = {
  stages: [
    { duration: '30s', target: Math.ceil(totalVUs / 4) },
    { duration: '30s', target: Math.ceil(totalVUs / 2) },
    { duration: '30s', target: Math.ceil(totalVUs) }, // ramp to target
    { duration: '2m', target: Math.ceil(totalVUs) }, // sustain load
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: [`rate<${errorThreshold}`], // <1% errors
    http_req_duration: [`p(95)<${averageResponseTime}`], // 95% under 1000ms
  },
};

export default function () {
  const res = http.get(apiUrl);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(thinkTime);
}
