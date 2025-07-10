import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaClient, Prisma } from "@prisma/client";

const DB_HOST = process.env.POSTGRES_HOST || "localhost";
const DB_USER = process.env.POSTGRES_USER || "postgres";
const DB_PWD = encodeURIComponent(process.env.POSTGRES_PASSWORD || "default"); // this needs to be encoded, if the password contains special characters it will break connection string.
const DB_PORT = process.env.POSTGRES_PORT || 5432;
const DB_NAME = process.env.POSTGRES_DATABASE || "postgres";
const DB_SCHEMA = process.env.POSTGRES_SCHEMA || "users";
const PGBOUNCER_URL = process.env.PGBOUNCER_URL;
const dataSourceURL = PGBOUNCER_URL?`${PGBOUNCER_URL}?schema=${DB_SCHEMA}&pgbouncer=true`:`postgresql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}&connection_limit=5`;

@Injectable()
class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query'> implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("PRISMA");
  private static instance: PrismaService;
  constructor() {
    if (PrismaService.instance) {
      return PrismaService.instance;
    }
    super({
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: dataSourceURL,
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ]
    });
    PrismaService.instance = this;
  }


  async onModuleInit() {
    await this.$connect();
    this.$on<any>('query', (e: Prisma.QueryEvent) => {
      // dont print the health check queries, which contains SELECT 1 or COMMIT , BEGIN, DEALLOCATE ALL
      // this is to avoid logging health check queries which are executed by the framework.
      const excludedPatterns = ["COMMIT", "BEGIN", "SELECT 1", "DEALLOCATE ALL"];
      if (excludedPatterns.some(pattern => e?.query?.toUpperCase().includes(pattern))) {
        return;
      }
      this.logger.log(
        `Query: ${e.query} - Params: ${e.params} - Duration: ${e.duration}ms`,
      );
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

export { PrismaService };
