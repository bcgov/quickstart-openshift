import { check } from "k6";
import * as http from "k6/http";
import { Rate } from "k6/metrics";


export let errorRate = new Rate("errors");


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
