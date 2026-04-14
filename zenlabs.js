import { check, sleep } from 'k6';
import http from 'k6/http';

//#region Test Configuration
const apiUrl = 'https://zenlabs-betguard.onrender.com';
const averageResponseTime = 1000; // milliseconds
const thinkTime = 10; // seconds
const totalUsers = 5;

const activeUsers = totalUsers * 0.25; // 25% of total users active at any time
const totalVUs = activeUsers * (averageResponseTime / thinkTime);
const errorThreshold = 1 / 100; // 1% error rate
//#endregion

//#region Helper Functions
function loginSuccess() {
  const payload = JSON.stringify({
    email: 'testerzero@gmail.com',
    password: 'Strong@password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${apiUrl}/api/v1/auth/sign_in`, payload, params);

  check(res, {
    'Successful login status 200': (r) => r.status === 200 || r.status === 201,
  });
}

function loginFail() {
  const payload = JSON.stringify({
    email: 'testerzero@gmail.com',
    password: 'WrongPassword123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${apiUrl}/api/v1/auth/sign_in`, payload, params);

  check(res, {
    'Failed login status 401': (r) => r.status === 401,
  });
}
//#endregion

//#region Test Options and Main Function
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
  // const random = Math.random();
  // if (random < 0.5) {
    loginSuccess();
  // } else {
  //   loginFail();
  // }

  sleep(thinkTime);
}
//#endregion
