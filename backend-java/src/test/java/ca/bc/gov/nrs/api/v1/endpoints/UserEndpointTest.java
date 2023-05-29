package ca.bc.gov.nrs.api.v1.endpoints;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import ca.bc.gov.nrs.api.helpers.TestHelper;
import ca.bc.gov.nrs.api.v1.repository.UserRepository;
import ca.bc.gov.nrs.api.v1.structs.User;
import ca.bc.gov.nrs.api.v1.structs.UserAddress;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;

@QuarkusTest
public class UserEndpointTest {

  ObjectMapper JSONB = new ObjectMapper();
  private final TestHelper testHelper;
  private final UserRepository userRepository;
  Long id;

  @Inject
  UserEndpointTest(TestHelper testHelper, UserRepository userRepository) {
    this.testHelper = testHelper;
    this.userRepository = userRepository;
  }

  @BeforeEach
  public void setup() {
    testHelper.clearDatabase();
    var user = testHelper.saveUser();
    testHelper.saveUserAddress(user);
    id = this.userRepository.findAll().stream().findFirst().get().getId();
  }

  @Test
  public void testGetAllUsers() {
    given()
        .basePath("/api/v1")
        .when().get("/users")
        .then()
        .statusCode(200)
        .body("$.size()", equalTo(1));
  }

  @Test
  public void testGetUserById() {

    given()
        .basePath("/api/v1")
        .pathParam("id", id)
        .when().get("/users/{id}")
        .then()
        .statusCode(200)
        .body("name", equalTo("John Doe"))
        .body("email", equalTo("johndoe@example.com"));
  }

  @Test
  public void testCreateUser() {
    User user = new User(null, "Jane Doe", "janedoe@example.com");
    given()
        .basePath("/api/v1")
        .contentType(ContentType.JSON)
        .body(user)
        .when().post("/users")
        .then()
        .statusCode(201)
        .body("name", equalTo("Jane Doe"))
        .body("email", equalTo("janedoe@example.com"));
  }

  @Test
  public void testUpdateUser() {
    User user = new User(id, "John Do", "johndo@example.com");
    given()
        .basePath("/api/v1")
        .contentType(ContentType.JSON)
        .pathParam("id", id)
        .body(user)
        .when().put("/users/{id}")
        .then()
        .statusCode(200)
        .body("name", equalTo("John Do"))
        .body("email", equalTo("johndo@example.com"));
  }

  @Test
  public void testDeleteUser() {
    given()
        .basePath("/api/v1")
        .pathParam("id", id)
        .when().delete("/users/{id}")
        .then()
        .statusCode(204);
  }

  @Test
  public void testGetUserAddresses() {
    given()
        .basePath("/api/v1")
        .pathParam("id", id)
        .when().get("/users/{id}/addresses")
        .then()
        .statusCode(200)
        .body("$.size()", equalTo(1));
  }

  @Test
  public void testCreateUserAddress() {
    UserAddress userAddress = new UserAddress(null, "123 Main St", "Vancouver", "BC", "V6B 2W9", 1L);
    given()
        .basePath("/api/v1")
        .contentType(ContentType.JSON)
        .pathParam("id", 1)
        .body(userAddress)
        .when().post("/users/{id}/addresses")
        .then()
        .statusCode(201)
        .body("street", equalTo("123 Main St"))
        .body("city", equalTo("Vancouver"))
        .body("state", equalTo("BC"))
        .body("zipCode", equalTo("V6B 2W9"))
        .body("userId", equalTo(1));
  }

  @Test
  public void testUpdateUserAddress() {
    UserAddress userAddress = new UserAddress(1L, "123 Main St", "Vancouver", "BC", "V6B 2W9", 1L);
    given()
        .basePath("/api/v1")
        .contentType(ContentType.JSON)
        .pathParam("id", 1)
        .pathParam("addressId", 1)
        .body(userAddress)
        .when().put("/users/{id}/addresses/{addressId}")
        .then()
        .statusCode(200)
        .body("street", equalTo("123 Main St"))
        .body("city", equalTo("Vancouver"))
        .body("state", equalTo("BC"))
        .body("zipCode", equalTo("V6B 2W9"))
        .body("userId", equalTo(1));
  }

  @Test
  public void testDeleteUserAddress() {
    given()
        .basePath("/api/v1")
        .pathParam("id", 1)
        .pathParam("addressId", 1)
        .when().delete("/users/{id}/addresses/{addressId}")
        .then()
        .statusCode(204);
  }
}
