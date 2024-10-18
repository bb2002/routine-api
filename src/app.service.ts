import { Injectable } from '@nestjs/common';
import { CosmosService } from './plugins/cosmos/cosmos.service';
import { PrismaService } from './plugins/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly cosmosService: CosmosService,
    private readonly prismaService: PrismaService,
  ) {}
  async isCosmosDBConnected(): Promise<boolean> {
    return !!(await this.cosmosService.getDatabase());
  }

  async isMySQLConnected(): Promise<boolean> {
    return !!(await this.prismaService.$queryRaw`SELECT 1 = 1;`);
  }

  getUptime() {
    return process.uptime();
  }
}
