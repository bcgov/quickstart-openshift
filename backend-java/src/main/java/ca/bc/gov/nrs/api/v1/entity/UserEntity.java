package ca.bc.gov.nrs.api.v1.entity;


import jakarta.persistence.*;

@Entity(name = "Users")
public class UserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
  @SequenceGenerator(name = "user_seq", sequenceName = "users_id_seq", allocationSize = 1)
  @Column(name = "id")
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  public UserEntity() {
  }

  public UserEntity(String name) {
    this.name = name;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public String toString() {
    return "Entity{" +
      "id=" + id +
      ", name='" + name + '\'' +
      ", email='" + email + '\'' +
      '}';
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((id == null) ? 0 : id.hashCode());
    result = prime * result + ((name == null) ? 0 : name.hashCode());
    result = prime * result + ((email == null) ? 0 : email.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    UserEntity userEntity = (UserEntity) o;

    if (!id.equals(userEntity.id)) return false;
    if (!name.equals(userEntity.name)) return false;
    return email.equals(userEntity.email);
  }
}
