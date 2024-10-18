import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '헬스체크' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '헬스체크 성공',
  })
  @Get()
  async getServerStatus() {
    const [isCosmosConnected, isMySQLConnected] = await Promise.all([
      this.appService.isCosmosDBConnected(),
      this.appService.isMySQLConnected(),
    ]);

    return `<h3>Welcome to routine-api!</h3><hr />
    CosmosDB Connection: <b>${isCosmosConnected}</b><br />
    MySQL Connection: <b>${isMySQLConnected}</b><br />
    Server Uptime: <b>${this.appService.getUptime()}</b><br />`;
  }
}
