import { check } from "k6";
import http from "k6/http";
import { Rate } from "k6/metrics";


export let errorRate = new Rate("errors");

// Fail the run (non-zero exit) when the target is down or erroring, instead of
// only reporting the failures in the summary.
export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"], // under 1% of requests may error (4xx/5xx or network)
    checks: ["rate>0.99"], // over 99% of status checks must pass
  },
};


function checkStatus(response, checkName, statusCode = 200) {
  let success = check(response, {
    [checkName]: (r) => {
      if (r.status === statusCode) {
        return true;
      } else {
        console.error(checkName + " failed. Incorrect response code." + r.status);
        return false;
      }
    }
  });
  errorRate.add(!success, { tag1: checkName });
}


export default function(token) {
  let url = `${__ENV.FRONTEND_URL}`;

  let res = http.get(url);
  checkStatus(res, "frontend", 200);

}
