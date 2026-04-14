import { check, sleep } from 'k6';
import http from 'k6/http';

//#region Test Configuration
const apiUrl = 'https://api.betguardpredictions.com';
// const apiUrl = 'https://zenlabs-betguard.onrender.com';
// const apiUrl = 'http://localhost:5004';
const averageResponseTime = 1000; // milliseconds
const thinkTime = 10; // seconds
const totalUsers = 1000;

const activeUsers = totalUsers * 0.5; // 50% of total users active at any time
const passThreshold = 90 / 100; // 90% of checks must pass
const responseTimeThreshold = 90; // 90% of requests should be under averageResponseTime
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
    password: 'Wrong@password123',
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

function fetchGames() {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.get(
    `${apiUrl}/api/v1/api_sports/odds_filtered?sportKey=39`,
    params,
  );

  check(res, {
    'Successful fetch games status 200': (r) =>
      r.status === 200 || r.status === 201,
  });
}
//#endregion

//#region Test Options and Main Function

// Regular load test configuration - ramp up to active users and sustain for 2 minutes
export const options = {
  stages: [
    { duration: '30s', target: Math.ceil(activeUsers / 4) },
    { duration: '30s', target: Math.ceil(activeUsers / 2) },
    { duration: '30s', target: Math.ceil(activeUsers) }, // ramp to target
    { duration: '2m', target: Math.ceil(activeUsers) }, // sustain load
    { duration: '30s', target: Math.ceil(activeUsers / 2) }, // ramp down
    { duration: '30s', target: Math.ceil(activeUsers / 4) },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    checks: [`rate>${passThreshold}`],
    http_req_duration: [`p(${responseTimeThreshold})<${averageResponseTime}`],
  },
};

// Stress test configuration - ramp up to 5x active users and sustain for 1 minute
// export const options = {
//   stages: [
//     { duration: '1m', target: Math.ceil(activeUsers * 2) },
//     { duration: '1m', target: Math.ceil(activeUsers * 3) },
//     { duration: '1m', target: Math.ceil(activeUsers * 4) },
//     { duration: '1m', target: Math.ceil(activeUsers * 5) },
//     { duration: '1m', target: 0 },
//   ],
//   thresholds: {
//     checks: [`rate>${passThreshold}`],
//     http_req_duration: [`p(${responseTimeThreshold})<${averageResponseTime}`],
//   },
// };

export default function () {
  const random = Math.random();
  if (random <= 0.3) {
    loginSuccess();
  } else if (random <= 0.6) {
    loginFail();
  }

  sleep(thinkTime);
}
//#endregion
