package ca.bc.gov.nrs.api.v1.repository;

import ca.bc.gov.nrs.api.v1.entity.UserAddressEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class UserAddressRepository implements PanacheRepository<UserAddressEntity> {
  public List<UserAddressEntity> findAllUserAddressesByUserId(Long userId) {
    return list("userEntity.id", userId);
  }
}
