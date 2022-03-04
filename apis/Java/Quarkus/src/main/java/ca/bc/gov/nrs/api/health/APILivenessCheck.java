package ca.bc.gov.nrs.api.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;

/**
 * This class is a MicroProfile Health Check to add custom health checks to the API.
 */
@Liveness
public class APILivenessCheck implements HealthCheck {

  @Override
  public HealthCheckResponse call() {
    return HealthCheckResponse.up("alive");
  }

}
