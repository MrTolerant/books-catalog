import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CatalogService from './catalog.service';
import Author from './author/author.model';
import Book from './book/book.model';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  providers: [CatalogService],
  exports: [CatalogService],
})
class CatalogModule {}
export default CatalogModule;
