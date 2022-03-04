package ca.bc.gov.nrs.api.v1.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="EMPLOYEE")
public class EmployeeEntity extends PanacheEntityBase {

  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator", parameters = {
    @Parameter(name = "uuid_gen_strategy_class", value = "org.hibernate.id.uuid.CustomVersionOneStrategy")})
  @Column(name = "EMPLOYEE_ID", unique = true, updatable = false, columnDefinition = "BINARY(16)")
  UUID employeeId;

  @Column(name = "FIRST_NAME")
  String firstName;

  @Column(name = "LAST_NAME")
  String lastName;

  @Column(name = "EMAIL")
  String email;

  @Column(name = "PHONE_NUMBER")
  String phone;

  @Column(name = "HIRE_DATE")
  LocalDate hireDate;

  @Column(name = "SALARY")
  Double salary;



  public UUID getEmployeeId() {
    return employeeId;
  }

  public void setEmployeeId(UUID employeeId) {
    this.employeeId = employeeId;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public LocalDate getHireDate() {
    return hireDate;
  }

  public void setHireDate(LocalDate hireDate) {
    this.hireDate = hireDate;
  }

  public Double getSalary() {
    return salary;
  }

  public void setSalary(Double salary) {
    this.salary = salary;
  }
  public EmployeeEntity() {
  }

  public EmployeeEntity(UUID employeeId, String firstName, String lastName, String email, String phone, LocalDate hireDate, Double salary) {
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.hireDate = hireDate;
    this.salary = salary;
  }
}
