import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/datasource';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { LoadersFactory } from './orders/graphql/loaders/loader.factory';
import { LoadersModule } from './orders/graphql/loaders/loader.module';
import { AuthModule } from './auth/auth.module';
import { FileRecordModule } from './file-record/file-record.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [LoadersFactory],
      imports: [LoadersModule],
      useFactory: (loadersFactory: LoadersFactory) => ({
        typePaths: [join(process.cwd(), 'src/**/*.graphql')],
        introspection: true,
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'class',
        },
        resolvers: {
          DateTime: GraphQLISODateTime,
        },
        context: () => ({
          loaders: loadersFactory.createLoaders(),
        }),
      }),
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    FileRecordModule,
    RabbitmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
