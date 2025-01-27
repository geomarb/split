import { Module } from '@nestjs/common';
import {
  mongooseTeamModule,
  mongooseTeamUserModule,
} from '../../infrastructure/database/mongoose.module';
import TeamsController from './controller/team.controller';
import {
  createTeamApplication,
  createTeamService,
  getTeamApplication,
  getTeamService,
} from './providers';

@Module({
  imports: [mongooseTeamModule, mongooseTeamUserModule],
  providers: [
    createTeamService,
    createTeamApplication,
    getTeamService,
    getTeamApplication,
  ],
  controllers: [TeamsController],
  exports: [getTeamApplication, getTeamService, createTeamService],
})
export default class TeamsModule {}
