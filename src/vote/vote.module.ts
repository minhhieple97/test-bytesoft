import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './vote.entity';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class ReportsModule {}
