package ca.bc.gov.nrs.api.v1.endpoint;

import ca.bc.gov.nrs.api.v1.model.EmployeeEntity;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.util.Optional;
import java.util.UUID;

@Path("/api/v1/employee")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("**")
public class EmployeeEndpoint {
  @Inject
  JsonWebToken accessToken;
  @GET
  @Transactional
  @Path("/{id}")
  @RolesAllowed("**")
  public Response getEmployeeByID(@PathParam("id") UUID id) {
    EmployeeEntity entity = EmployeeEntity.findById(id);
    if (entity == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    } else {
      return Response.ok(entity).build();
    }
  }

  @POST
  @Transactional
  public Response createEmployee(EmployeeEntity employeeEntity) {
    if (employeeEntity == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\" employee cannot be null in POST.\"}").build();
    }
    if (employeeEntity.getEmployeeId() != null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\" employee Id is not allowed in POST.\"}").build();
    }
    employeeEntity.persist();
    return Response.created(URI.create("/api/v1/employee/" + employeeEntity.getEmployeeId())).build();
  }

  @PUT
  @Path("/{id}")
  @Transactional
  public Response updateEmployee(@PathParam("id") UUID id, EmployeeEntity employeeEntity) {
    if (id == null || employeeEntity.getEmployeeId() == null || !id.equals(employeeEntity.getEmployeeId())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\" employee Id can not be null in PUT.\"}").build();
    }
    Optional<EmployeeEntity> entityOptional = EmployeeEntity.findByIdOptional(id);
    if (entityOptional.isEmpty()) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    EmployeeEntity entity = entityOptional.get();
    entity.setFirstName(employeeEntity.getFirstName());
    entity.setLastName(employeeEntity.getLastName());
    entity.setEmail(employeeEntity.getEmail());
    entity.setPhone(employeeEntity.getPhone());
    entity.setHireDate(employeeEntity.getHireDate());
    entity.setSalary(employeeEntity.getSalary());
    EmployeeEntity.persist(entity);
    return Response.ok(entity).build();
  }

  @DELETE
  @Path("/{id}")
  @Transactional
  public Response deleteEmployee(@PathParam("id") UUID id) {
    if (id == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\" employee Id can not be null in PUT.\"}").build();
    }
    Optional<EmployeeEntity> entityOptional = EmployeeEntity.findByIdOptional(id);
    if (entityOptional.isEmpty()) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    EmployeeEntity.deleteById(entityOptional.get().getEmployeeId());
    return Response.noContent().build();
  }
}
