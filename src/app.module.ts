import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import LibraryModule from './api/library.module';
import { GraphQLModule } from '@nestjs/graphql';
import AuthorResolver from './api/author/author.resolver';
import BookResolver from './api/book/book.resolver';
import * as depthLimit from 'graphql-depth-limit';
import {
  authorBooksLoader,
  bookAuthorsLoader,
} from './api/all.loader';

const graphQLImports = [BookResolver, AuthorResolver];

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    LibraryModule,
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
