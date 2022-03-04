package ca.bc.gov.nrs.api.v1.endpoint;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.h2.H2DatabaseTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(H2DatabaseTestResource.class)
@TestSecurity(authorizationEnabled = false)
class EmployeeEndpointTest {

  @Test
  void getEmployeeByID_whenInvalidIDGiven_shouldRespond404() {
    given().when().get("/api/v1/employee/9648afca-b7fe-4181-90f3-f06f293e211d").then().statusCode(404);
  }
}
