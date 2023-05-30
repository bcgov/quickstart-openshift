package ca.bc.gov.nrs.api.v1.structs;

import ca.bc.gov.nrs.api.v1.entity.UserAddressEntity;
import ca.bc.gov.nrs.api.v1.entity.UserEntity;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record UserAddress(
  @Schema(description = "The user address ID", example = "1") Long id,
  @Schema(description = "The street address", example = "123 Main St") String street,
  @Schema(description = "The city", example = "Vancouver") String city,
  @Schema(description = "The state or province", example = "BC") String state,
  @Schema(description = "The ZIP or postal code", example = "V6B 2W9") String zipCode,
  @Schema(description = "The user ID", example = "1") Long userId
) {
  public static UserAddress toUserAddressRecord(UserAddressEntity userAddressEntity) {
    return new UserAddress(
      userAddressEntity.getId(),
      userAddressEntity.getStreet(),
      userAddressEntity.getCity(),
      userAddressEntity.getState(),
      userAddressEntity.getZipCode(),
      userAddressEntity.getUser().getId()
    );
  }

  public static UserAddressEntity toUserAddressEntity(UserAddress userAddress, UserEntity userEntity) {
    UserAddressEntity userAddressEntity = new UserAddressEntity();
    userAddressEntity.setId(userAddress.id());
    userAddressEntity.setStreet(userAddress.street());
    userAddressEntity.setCity(userAddress.city());
    userAddressEntity.setState(userAddress.state());
    userAddressEntity.setZipCode(userAddress.zipCode());
    userAddressEntity.setUser(userEntity);
    return userAddressEntity;
  }
  public static UserAddressEntity toUserAddressEntityAttached(UserAddress userAddress, UserEntity userEntity, UserAddressEntity userAddressEntity) {
    userAddressEntity.setStreet(userAddress.street());
    userAddressEntity.setCity(userAddress.city());
    userAddressEntity.setState(userAddress.state());
    userAddressEntity.setZipCode(userAddress.zipCode());
    userAddressEntity.setUser(userEntity);
    return userAddressEntity;
  }
}
