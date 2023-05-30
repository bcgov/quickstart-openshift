package ca.bc.gov.nrs.api.v1.endpoints;

import ca.bc.gov.nrs.api.helpers.TestHelper;
import ca.bc.gov.nrs.api.v1.repository.UserRepository;
import ca.bc.gov.nrs.api.v1.structs.User;
import ca.bc.gov.nrs.api.v1.structs.UserAddress;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

@QuarkusTest
class UserEndpointTest {

  private final TestHelper testHelper;
  private final UserRepository userRepository;
  Long id;
  Long addressId;

  @Inject
  UserEndpointTest(TestHelper testHelper, UserRepository userRepository) {
    this.testHelper = testHelper;
    this.userRepository = userRepository;
  }

  @BeforeEach
  void setup() {
    testHelper.clearDatabase();
    var user = testHelper.saveUser();
    testHelper.saveUserAddress(user);
    id = this.userRepository.findAll().stream().findFirst().orElseThrow().getId();
    addressId = this.userRepository.findAll().stream().findFirst().orElseThrow().getAddresses().stream().findFirst().orElseThrow().getId();
  }

  @Test
  void testGetAllUsers_noCondition_shouldReturnAllUsersAndStatusOK() {
    given()
      .basePath("/api/v1")
      .when().get("/users")
      .then()
      .statusCode(200)
      .body("$.size()", equalTo(1));
  }

  @Test
  void testGetUserById_givenValidID_shouldReturnTheUserAndStatusOK() {

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
  void testGetUserById_givenRandomID_shouldReturnTheUserAndStatusOK() {

    given()
      .basePath("/api/v1")
      .pathParam("id", 20000)
      .when().get("/users/{id}")
      .then()
      .statusCode(404);
  }
  @Test
  void testCreateUser_givenValidPayload_shouldReturnStatusCreated() {
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
  void testCreateUser_givenInValidPayload_shouldReturnStatusBadRequest() {
    User user = new User(null, "Jane Doe", "random");
    given()
      .basePath("/api/v1")
      .contentType(ContentType.JSON)
      .body(user)
      .when().post("/users")
      .then()
      .statusCode(400);
  }

  @Test
  void testUpdateUser_givenValidPayload_shouldReturnStatusOK() {
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
  void testDeleteUser_givenValidID_shouldReturnStatusNoContent() {
    given()
      .basePath("/api/v1")
      .pathParam("id", id)
      .when().delete("/users/{id}")
      .then()
      .statusCode(204);
  }

  @Test
  void testDeleteUser_givenInvalidID_shouldReturnStatusNotFound() {
    given()
      .basePath("/api/v1")
      .pathParam("id", id)
      .when().delete("/users/{id}")
      .then()
      .statusCode(204);
  }

  @Test
  void testGetUserAddresses_noCondition_shouldReturnAllUsersAddressesAndStatusOK() {
    given()
      .basePath("/api/v1")
      .pathParam("id", id)
      .when().get("/users/{id}/addresses")
      .then()
      .statusCode(200)
      .body("$.size()", equalTo(1));
  }

  @Test
  void testCreateUserAddress_givenValidPayload_shouldCreateTheUserAddressAndReturnStatusCreated() {
    UserAddress userAddress = new UserAddress(null, "123 Main St", "Vancouver", "BC", "V6B 2W9", id);
    given()
      .basePath("/api/v1")
      .contentType(ContentType.JSON)
      .pathParam("id", id)
      .body(userAddress)
      .when().post("/users/{id}/addresses")
      .then()
      .statusCode(201)
      .body("street", equalTo("123 Main St"))
      .body("city", equalTo("Vancouver"))
      .body("state", equalTo("BC"))
      .body("zipCode", equalTo("V6B 2W9"));
  }

  @Test
  void testUpdateUserAddress_givenValidPayload_shouldUpdateTheUserAddressAndReturnStatusOK() {
    UserAddress userAddress = new UserAddress(addressId, "124 Main St", "Victoria", "BC", "V6B 2W9", id);
    given()
      .basePath("/api/v1")
      .contentType(ContentType.JSON)
      .pathParam("id", id)
      .pathParam("addressId", addressId)
      .body(userAddress)
      .when().put("/users/{id}/addresses/{addressId}")
      .then()
      .statusCode(200)
      .body("street", equalTo("124 Main St"))
      .body("city", equalTo("Victoria"))
      .body("state", equalTo("BC"))
      .body("zipCode", equalTo("V6B 2W9"));
  }

  @Test
  void testDeleteUserAddress_givenValidPayload_shouldDeleteTheUserAddressAndReturnStatusNoContent() {
    given()
      .basePath("/api/v1")
      .pathParam("id", id)
      .pathParam("addressId", addressId)
      .when().delete("/users/{id}/addresses/{addressId}")
      .then()
      .statusCode(204);
  }
}
