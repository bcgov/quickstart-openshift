package ca.bc.gov.nrs.api.v1.service;

import ca.bc.gov.nrs.api.v1.entity.UserAddressEntity;
import ca.bc.gov.nrs.api.v1.entity.UserEntity;
import ca.bc.gov.nrs.api.v1.repository.UserAddressRepository;
import ca.bc.gov.nrs.api.v1.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
@Transactional(Transactional.TxType.MANDATORY)
public class UserService {

  private final UserRepository userRepository;
  private final UserAddressRepository userAddressRepository;

  @Inject
  public UserService(UserRepository userRepository, UserAddressRepository userAddressRepository) {
    this.userRepository = userRepository;
    this.userAddressRepository = userAddressRepository;
  }

  public List<UserEntity> findAll() {
    return userRepository.findAll().stream().toList();
  }

  public Optional<UserEntity> findById(Long id) {
    return userRepository.findByIdOptional(id);
  }

  public UserEntity save(UserEntity userEntity) {
    userRepository.persist(userEntity);
    return userEntity;
  }

  public void deleteById(Long id) {
    userRepository.deleteById(id);
  }

  public void delete(UserEntity userEntity) {
    userRepository.delete(userEntity);
  }


  public Optional<UserAddressEntity> findUserAddressById(Long id) {
    return userAddressRepository.findByIdOptional(id);
  }

  public UserAddressEntity saveUserAddress(UserAddressEntity userAddressEntity) {
    userAddressRepository.persist(userAddressEntity);
    return userAddressEntity;
  }

  public void deleteUserAddressById(Long id) {
    userAddressRepository.deleteById(id);
  }

}
