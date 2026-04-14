import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,        // virtual users
  duration: '30s' // total test duration
};

export default function () {
  const res = http.get('https://test.k6.io');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}