let prisma: PrismaClient;
import {PrismaClient} from '@prisma/client';


if (!prisma) {
  prisma = new PrismaClient({
    log: ['query', 'info', "error", "warn"],
    errorFormat: 'pretty',
    datasourceUrl: `postgresql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}&connection_limit=5`

  });
}

export default prisma;
