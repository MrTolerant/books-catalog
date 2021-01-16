import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LibraryService from './library.service';
import Author from './author/author.model';
import Book from './book/book.model';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  providers: [LibraryService],
  exports: [LibraryService],
})
class LibraryModule {}
export default LibraryModule;
