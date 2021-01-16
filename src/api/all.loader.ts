import DataLoader = require('dataloader');
import { getRepository } from 'typeorm';
import Author from './author/author.model';
import Book from './book/book.model';

const batchAuthors = async (booksIds: number[]) => {
  const authorBooks = await getRepository(Book)
    .createQueryBuilder('book')
    .leftJoinAndSelect('book.authorsConnection', 'authors')
    .where('book.id IN(:...ids)', { ids: booksIds })
    .getMany();

  return authorBooks.map((authorBook) => authorBook.authorsConnection || []);
};
const batchBooks = async (authorIds: number[]) => {
  const bookAuthors = await getRepository(Author)
    .createQueryBuilder('author')
    .leftJoinAndSelect('author.booksConnection', 'books')
    .where('author.id IN(:...ids)', { ids: authorIds })
    .getMany();

  return bookAuthors.map((bookAuthor) => bookAuthor.booksConnection || []);
};

const bookAuthorsLoader = () => new DataLoader(batchAuthors);
const authorBooksLoader = () => new DataLoader(batchBooks);

export { bookAuthorsLoader, authorBooksLoader };
