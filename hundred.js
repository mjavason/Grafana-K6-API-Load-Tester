import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 }, // ramp to target
    { duration: '2m', target: 100 }, // sustain load
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // <1% errors
    http_req_duration: ['p(95)<500'], // 95% under 500ms
  },
};

export default function () {
  const res = http.get('https://test.k6.io');

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}
