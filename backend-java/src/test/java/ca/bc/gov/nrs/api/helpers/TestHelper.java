package ca.bc.gov.nrs.api.helpers;

import ca.bc.gov.nrs.api.v1.entity.UserAddressEntity;
import ca.bc.gov.nrs.api.v1.entity.UserEntity;
import ca.bc.gov.nrs.api.v1.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class TestHelper {
    private final UserRepository userRepository;

    @Inject
    TestHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void clearDatabase() {
        this.userRepository.deleteAll();
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public UserEntity saveUser() {
        UserEntity user = new UserEntity();
        user.setName("John Doe");
        user.setEmail("johndoe@example.com");
        this.userRepository.persist(user);
        return user;
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public UserAddressEntity saveUserAddress(UserEntity userEntity) {
        var savedUser = userRepository.findById(userEntity.getId());
        UserAddressEntity userAddress = new UserAddressEntity();
        userAddress.setUser(userEntity);
        userAddress.setStreet("123 Main St");
        userAddress.setCity("Vancouver");
        userAddress.setState("BC");
        userAddress.setZipCode("V6B 1H7");
        savedUser.getAddresses().add(userAddress);
        userRepository.persist(savedUser);
        return savedUser.getAddresses().get(0);
    }
}
