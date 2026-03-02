import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { runSeeder } from 'typeorm-extension';
import MainSeeder from './seeds';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  database: configService.getOrThrow('POSTGRES_DATABASE'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsTableName: 'migrations',
  factories: ['dist/db/factories/**/*{.ts,.js}'],
  seeds: ['dist/db/seeds/**/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

dataSource.initialize();

// tried to seed data via CLI - not successful, got an error
// runSeeder(dataSource, MainSeeder);

export default dataSource;
