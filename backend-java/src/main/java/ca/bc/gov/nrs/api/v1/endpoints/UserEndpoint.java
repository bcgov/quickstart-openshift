package ca.bc.gov.nrs.api.v1.endpoints;

import ca.bc.gov.nrs.api.v1.entity.UserAddressEntity;
import ca.bc.gov.nrs.api.v1.entity.UserEntity;
import ca.bc.gov.nrs.api.v1.service.UserService;
import ca.bc.gov.nrs.api.v1.structs.User;
import ca.bc.gov.nrs.api.v1.structs.UserAddress;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import java.util.List;
import java.util.Optional;

@Path("/api/v1/users")
@Produces("application/json")
@Consumes("application/json")
@Transactional(Transactional.TxType.REQUIRES_NEW)
@Tag(name = "User", description = "User operations")
public class UserEndpoint {

  private final UserService userService;

  @Inject
  public UserEndpoint(UserService userService) {
    this.userService = userService;
  }

  @GET
  @Operation(summary = "Get all users", description = "Returns a list of all users")
  @APIResponse(responseCode = "200", description = "List of users")
  public List<User> getAllUsers() {
    return userService.findAll().stream().map(User::toUserRecord).toList();
  }

  @GET
  @Path("/{id}")
  @Operation(summary = "Get user by ID", description = "Returns a user by ID")
  @APIResponse(responseCode = "200", description = "User found")
  @APIResponse(responseCode = "404", description = "User not found")

  public Response getUserById(@PathParam("id") Long id) {
    Optional<UserEntity> user = userService.findById(id);
    if (user.isPresent()) {
      return Response.ok(User.toUserRecord(user.get())).build();
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }

  @POST
  @Operation(summary = "Create user", description = "Creates a new user")
  @APIResponse(responseCode = "201", description = "User created")
  public Response createUser(@Valid User user) {
    User createdUser = User.toUserRecord(userService.save(User.toUserEntity(user)));
    return Response.status(Response.Status.CREATED).entity(createdUser).build();
  }

  @PUT
  @Path("/{id}")
  @Operation(summary = "Update user by ID", description = "Updates a user by ID")
  @APIResponse(responseCode = "200", description = "User updated")
  @APIResponse(responseCode = "404", description = "User not found")

  public Response updateUser(@PathParam("id") Long id, User user) {
    Optional<UserEntity> existingUser = userService.findById(id);
    if (existingUser.isPresent()) {
      User updatedUser = User.toUserRecord(userService.save(User.toAttachedUserEntity(user, existingUser.get())));
      return Response.ok(updatedUser).build();
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }

  @DELETE
  @Path("/{id}")
  @Operation(summary = "Delete user by ID", description = "Deletes a user by ID")
  @APIResponse(responseCode = "204", description = "User deleted")
  @APIResponse(responseCode = "404", description = "User not found")
  public Response deleteUser(@PathParam("id") Long id) {
    Optional<UserEntity> user = userService.findById(id);
    if (user.isPresent()) {
      userService.deleteById(id);
      return Response.noContent().build();
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }

  @GET
  @Path("/{id}/addresses")
  @Operation(summary = "Get all addresses for user", description = "Returns a list of all addresses for a user")
  @APIResponse(responseCode = "200", description = "List of addresses")
  @APIResponse(responseCode = "404", description = "User not found")
  public Response getAllAddressesForUser(@PathParam("id") Long id) {
    Optional<UserEntity> optionalUserEntity = userService.findById(id);
    if (optionalUserEntity.isPresent()) {
      List<UserAddress> addresses = optionalUserEntity.get().getAddresses().stream().map(UserAddress::toUserAddressRecord)
        .toList();
      return Response.ok(addresses).build();
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }

  @GET
  @Path("/{id}/addresses/{addressId}")
  @Operation(summary = "Get address by ID for user", description = "Returns an address by ID for a user")
  @APIResponse(responseCode = "200", description = "Address found")
  @APIResponse(responseCode = "404", description = "Address not found")
  public Response getAddressByIdForUser(@PathParam("id") Long id, @PathParam("addressId") Long addressId) {
    Optional<UserEntity> user = userService.findById(id);
    if (user.isPresent()) {
      Optional<UserAddressEntity> address = userService.findUserAddressById(addressId);
      if (address.isPresent()) {
        return Response.ok(UserAddress.toUserAddressRecord(address.get())).build();
      } else {
        return Response.status(Response.Status.NOT_FOUND).build();
      }
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }

  @POST
  @Path("/{id}/addresses")
  @Operation(summary = "Create address for user", description = "Creates a new address for a user")
  @APIResponse(responseCode = "201", description = "Address created")
  @APIResponse(responseCode = "404", description = "User not found")
  public Response createAddressForUser(@PathParam("id") Long id,
                                       @Valid @RequestBody(description = "Address to create") UserAddress address) {
    Optional<UserEntity> user = userService.findById(id);
    if (user.isPresent()) {
      UserAddress createdAddress = UserAddress
        .toUserAddressRecord(userService.saveUserAddress(UserAddress.toUserAddressEntity(address, user.get())));
      return Response.status(Response.Status.CREATED).entity(createdAddress).build();
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }

  @PUT
  @Path("/{id}/addresses/{addressId}")
  @Operation(summary = "Update address by ID for user", description = "Updates an address by ID for a user")
  @APIResponse(responseCode = "200", description = "Address updated")
  @APIResponse(responseCode = "404", description = "Address not found")
  public Response updateAddressByIdForUser(@PathParam("id") Long id, @PathParam("addressId") Long addressId,
                                           @Valid @RequestBody(description = "Address to update") UserAddress address) {
    Optional<UserEntity> user = userService.findById(id);
    if (user.isPresent()) {
      Optional<UserAddressEntity> existingAddress = userService.findUserAddressById(addressId);
      if (existingAddress.isPresent()) {
        UserAddressEntity updatedAddressEntity = UserAddress.toUserAddressEntityAttached(address, user.get(), existingAddress.get());
        var addressEntity = userService.saveUserAddress(updatedAddressEntity);
        return Response.ok(UserAddress.toUserAddressRecord(addressEntity)).build();
      } else {
        return Response.status(Response.Status.NOT_FOUND).build();
      }
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }

  @DELETE
  @Path("/{id}/addresses/{addressId}")
  @Operation(summary = "Delete address by ID for user", description = "Deletes an address by ID for a user")
  @APIResponse(responseCode = "204", description = "Address deleted")
  @APIResponse(responseCode = "404", description = "Address not found")
  public Response deleteAddressByIdForUser(@PathParam("id") Long id, @PathParam("addressId") Long addressId) {
    Optional<UserEntity> user = userService.findById(id);
    if (user.isPresent()) {
      Optional<UserAddressEntity> existingAddress = userService.findUserAddressById(addressId);
      if (existingAddress.isPresent()) {
        userService.deleteUserAddressById(existingAddress.get().getId());
        return Response.noContent().build();
      } else {
        return Response.status(Response.Status.NOT_FOUND).build();
      }
    } else {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
  }
}
