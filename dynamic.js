import { check, sleep } from 'k6';
import http from 'k6/http';

const apiUrl = 'https://test.k6.io';
const averageResponseTime = 1000; // milliseconds
const thinkTime = 10; // seconds
const totalUsers = 25;

const activeUsers = totalUsers * 0.25; // 25% of total users active at any time
const errorThreshold = 1 / 100; // 1% error rate
const passThreshold = 90 / 100; // 90% of checks must pass

export const options = {
  stages: [
    { duration: '30s', target: Math.ceil(activeUsers / 4) },
    { duration: '30s', target: Math.ceil(activeUsers / 2) },
    { duration: '30s', target: Math.ceil(activeUsers) }, // ramp to target
    { duration: '2m', target: Math.ceil(activeUsers) }, // sustain load
    { duration: '30s', target: 0 }, // ramp down to 0
  ],
  thresholds: {
    checks: [`rate>${passThreshold}`], // 90% of checks must pass
    http_req_failed: [`rate<${errorThreshold}`], // <1% http errors (anything except 2xx or 3xx)
    http_req_duration: [`p(90)<${averageResponseTime}`], // 90% of requests under average response time threshold
  },
};

export default function () {
  const res = http.get(apiUrl);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(thinkTime);
}
