import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Knex from 'knex';
import * as knexConfig from '../../knexfile';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'KnexConnection',
      useFactory: async (configService: ConfigService) => {
        const knex = Knex.default(knexConfig);
        return knex;
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: ['KnexConnection', DatabaseService],
})
export class DatabaseModule {}
