package ca.bc.gov.nrs.api.v1.entity;

import jakarta.persistence.*;

@Entity(name = "UserAddress")
@Table(name = "user_addresses")
public class UserAddressEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_address_seq")
  @SequenceGenerator(name = "user_address_seq", sequenceName = "user_addresses_id_seq", allocationSize = 1)
  private Integer id;

  @Column(name = "street", nullable = false, length = 50)
  private String street;

  @Column(name = "city", nullable = false, length = 50)
  private String city;

  @Column(name = "state", nullable = false, length = 50)
  private String state;

  @Column(name = "zip_code", nullable = false, length = 10)
  private String zipCode;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity userEntity;

  public UserAddressEntity() {
  }

  public UserAddressEntity(String street, String city, String state, String zipCode, UserEntity userEntity) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.userEntity = userEntity;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getStreet() {
    return street;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public String getZipCode() {
    return zipCode;
  }

  public void setZipCode(String zipCode) {
    this.zipCode = zipCode;
  }

  public UserEntity getUser() {
    return userEntity;
  }

  public void setUser(UserEntity userEntity) {
    this.userEntity = userEntity;
  }
}
