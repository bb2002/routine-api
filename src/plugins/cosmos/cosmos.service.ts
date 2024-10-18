import { Injectable } from '@nestjs/common';
import { Container, CosmosClient, Database } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';

interface IGetDatabaseAndContainer {
  database: Database;
  container: Container;
}

@Injectable()
export class CosmosService {
  private readonly cosmosClient: CosmosClient;
  constructor(private readonly configService: ConfigService) {
    const COSMOS_DATABASE_URL = this.configService.get<string>(
      'COSMOS_DATABASE_URL',
    );

    if (!COSMOS_DATABASE_URL) {
      throw new Error('COSMOS_DATABASE_URL is not defined');
    }

    this.cosmosClient = new CosmosClient(COSMOS_DATABASE_URL);
  }

  async getDatabase(databaseId = 'routine'): Promise<Database> {
    const { database } = await this.cosmosClient.databases.createIfNotExists({
      id: databaseId,
    });

    return database;
  }

  async getContainer(database: Database, containerId: string) {
    const { container } = await database.containers.createIfNotExists({
      id: containerId,
    });

    return container;
  }

  async getDatabaseAndContainer(
    containerId: string,
    databaseId?: string,
  ): Promise<IGetDatabaseAndContainer> {
    const database = await this.getDatabase(databaseId);
    const container = await this.getContainer(database, containerId);
    return { database, container };
  }

  get client() {
    return this.cosmosClient;
  }
}
