package ca.bc.gov.nrs.api.v1.endpoint;

import ca.bc.gov.nrs.api.v1.model.EmployeeEntity;

import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.util.UUID;

@Path("/api/v1/employee")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EmployeeEndpoint {

  @GET
  @Path("/{id}")
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
    if(employeeEntity.getEmployeeId() != null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("{\"message\":\" employee Id is not allowed in POST.\"}").build();
    }
    employeeEntity.persist();
    return Response.created(URI.create("/api/v1/employee/" + employeeEntity.getEmployeeId())).build();
  }
}
