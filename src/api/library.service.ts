import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Author from './author/author.model';
import Book from './book/book.model';

@Injectable()
class LibraryService {
  public constructor(
    @InjectRepository(Author) public readonly authorRepo: Repository<Author>,
    @InjectRepository(Book) public readonly bookRepo: Repository<Book>,
  ) {}
}

export default LibraryService;
