import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger = new Logger();

  constructor() {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL,
    });

    super({ adapter });

    // 🎨 roxo ANSI
    this.logger.log('\x1b[35m[Database]\x1b[0m Conectado com Better SQLite3');
  }
}
