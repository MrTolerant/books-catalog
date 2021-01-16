import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import CatalogModule from './api/catalog.module';
import { GraphQLModule } from '@nestjs/graphql';
import AuthorResolver from './api/author/author.resolver';
import BookResolver from './api/book/book.resolver';
import * as depthLimit from 'graphql-depth-limit';
import {
  authorBooksLoader,
  bookAuthorsLoader,
} from './api/catalog.loader';

const graphQLImports = [BookResolver, AuthorResolver];

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    CatalogModule,
    ...graphQLImports,
    GraphQLModule.forRoot({
      path: '/',
      autoSchemaFile: 'schema.gql',
      playground: true,
      context: {
        bookAuthorsLoader: bookAuthorsLoader(),
        authorBooksLoader: authorBooksLoader(),
      },
      validationRules: [depthLimit(5)],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
