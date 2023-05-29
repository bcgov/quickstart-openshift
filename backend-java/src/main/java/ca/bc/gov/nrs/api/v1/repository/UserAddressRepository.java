package ca.bc.gov.nrs.api.v1.repository;

import ca.bc.gov.nrs.api.v1.entity.UserAddressEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserAddressRepository implements PanacheRepository<UserAddressEntity> {
}
