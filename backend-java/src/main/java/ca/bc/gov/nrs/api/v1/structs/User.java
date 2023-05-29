package ca.bc.gov.nrs.api.v1.structs;

import ca.bc.gov.nrs.api.v1.entity.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record User(@Schema(description = "The user ID", example = "1") Long id,
    @NotBlank(message = "Name cannot be blank") @Size(max = 50, message = "Name cannot be longer than 50 characters") @Schema(description = "The user name", example = "John Doe") String name,
    @NotBlank(message = "Email cannot be blank") @Size(max = 50, message = "Email cannot be longer than 50 characters") @Email(message = "Email should be valid") @Schema(description = "The user email", example = "johndoe@example.com") String email

) {
  public static User toUserRecord(UserEntity userEntity) {
    return new User(userEntity.getId(), userEntity.getName(), userEntity.getEmail());
  }

  public static UserEntity toUserEntity(User user) {
    UserEntity userEntity = new UserEntity();
    userEntity.setId(user.id());
    userEntity.setName(user.name());
    userEntity.setEmail(user.email());
    return userEntity;
  }

  public static UserEntity toAttachedUserEntity(User user, UserEntity userEntity) {
    userEntity.setName(user.name());
    userEntity.setEmail(user.email());
    return userEntity;
  }
}
