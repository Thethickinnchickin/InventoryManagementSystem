import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject repository for DB check
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check the health of the API' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  async check() {
    let dbStatus = 'ok';

    try {
      // Simple query to verify database connection
      await this.userRepository.findOne({ where: { id: 1 } });
    } catch (err) {
      dbStatus = 'error';
    }

    return {
      status: 'ok',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
