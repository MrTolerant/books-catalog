import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import CatalogService from '../catalog.service';
import Author from '../author/author.model';
import Book from './book.model';
import BookDto from './book.dto';
import { ID, Int } from '@nestjs/graphql';
import { getConnection, Like } from 'typeorm';
import { MyContext } from '../types/graphql.type';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly CatalogService: CatalogService) {}

  @Query(() => Book, { nullable: true })
  public async getBook(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<Book> {
    return this.CatalogService.bookRepo.findOne({ where: { id } });
  }

  @Query(() => [Book], { nullable: true })
  public async getBooks(
    @Args({ name: 'title', type: () => String, nullable: true  }) title: string,
  ): Promise<Book[]> {
    if (title) return this.CatalogService.bookRepo.find({ where: { title: Like(title) } });
    return this.CatalogService.bookRepo.find()
  }

  @Mutation(() => Book)
  public async createBook(
    @Args({ name: 'book', type: () => BookDto }) input: BookDto,
  ): Promise<Book> {
    return await getConnection().transaction(
      async (entityManager: EntityManager) => {
        const book = new Book(input.title);
        const resultBook = await entityManager.save(book);

        await entityManager
          .createQueryBuilder()
          .relation(Book, 'authorsConnection')
          .of(resultBook)
          .add(input.authorIds);

        return resultBook;
      },
    );
  }

  @Mutation(() => Int)
  public async deleteBook(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<number> {
    return await getConnection().transaction(
      async (entityManager: EntityManager) => {
        const book: Book = await entityManager
          .createQueryBuilder(Book, 'book')
          .leftJoinAndSelect('book.authorsConnection', 'authors')
          .where('book.id = :id', { id })
          .getOne();

        if (!book) {
          throw new Error(`There is no book with id:${id}`);
        }

        await entityManager
          .createQueryBuilder()
          .relation(Book, 'authorsConnection')
          .of(book)
          .remove(book.authorsConnection);
        return (await entityManager.delete(Book, id)).affected;
      },
    );
  }

  @ResolveProperty('authors', () => [Author], { nullable: true })
  public async authors(
    @Parent() parent,
    @Context() { bookAuthorsLoader }: MyContext,
  ): Promise<Author[]> {
    return bookAuthorsLoader.load(parent.id);
  }
}

export default BookResolver;
