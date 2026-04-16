# Grafana-K6-API-Load-Tester

A simple demonstration of API loading testing with Grafana K6

**Prerequisites**

- Node.js and npm (or yarn) installed on your system. You can download them from the [official Node.js website](https://nodejs.org).
- Download and install Grafana K6
- Calculate Average Request Duration
- Calculate Active Users: 25% of total estimated users. If you're expecting 100 total users. 25 is a good estimate
- Calculate Think Time: The delay between actions of a real user in seconds (sleep)

**Installation**

1. Clone this repository using git:

   ```bash
   git clone https://github.com/mjavason/...
   ```

2. Navigate to the project directory:

   ```bash
   cd project-name...
   ```

**Running the project**

After installing Grafana K6, the `k6` command should be available to you

- Copy the dynamic.js file and fill in the necessary variables
- run the file `k6 ./file_name.js`
