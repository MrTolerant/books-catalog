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
import Author from './author.model';
import AuthorDto from './author.dto';
import { ID, Int } from '@nestjs/graphql';
import { MyContext } from '../types/graphql.type';
import Book from '../book/book.model';
import { getConnection, SelectQueryBuilder } from 'typeorm';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly CatalogService: CatalogService) {}

  private async _getAuthorById(
    entityManager: EntityManager,
    id: number,
  ): Promise<Author> {
    return entityManager
      .createQueryBuilder(Author, 'author')
      .leftJoinAndSelect('author.booksConnection', 'books')
      .where('author.id = :id', { id })
      .getOne();
  }

  @Query(() => Author, { nullable: true })
  public async getAuthor(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<Author> {
    return this.CatalogService.authorRepo.findOne({ where: { id } });
  }

  @Query(() => [Author])
  public async getAuthors(
    @Args({ name: 'minNumberOfBooks', type: () => Int, nullable: true })
    minNumberOfBooks: number,
    @Args({ name: 'maxNumberOfBooks', type: () => Int, nullable: true })
    maxNumberOfBooks: number,
  ): Promise<Author[]> {
    if (minNumberOfBooks || maxNumberOfBooks) {
      let havingCondition = '';

      if (minNumberOfBooks) {
        havingCondition += `count(bookId) >= ${minNumberOfBooks}`;
      }
      if (maxNumberOfBooks) {
        const logicalOperator: string = havingCondition.length ? ' AND ' : ' ';
        havingCondition += `${logicalOperator}${
          'count(bookId) <= ' + maxNumberOfBooks
        }`;
      }

      return await this.CatalogService.authorRepo
        .createQueryBuilder('author')
        .leftJoinAndSelect('books_authors', 'ba', 'ba.authorId = id')
        .where((qb: SelectQueryBuilder<Author>) => {
          const subQuery: string = qb
            .subQuery()
            .select('authorId as id')
            .from('books_authors', 'ba')
            .groupBy('authorId')
            .having(havingCondition)
            .getQuery();

          return `id IN (${subQuery})`;
        })
        .orderBy('id')
        .getMany();
    }

    return  this.CatalogService.authorRepo.find();
  }

  @Mutation(() => Author)
  public async createAuthor(
    @Args('author') input: AuthorDto,
  ): Promise<Author> {
    return this.CatalogService.authorRepo.save({
      firstName: input.firstName,
      lastName: input.lastName,
    });
  }

  @Mutation(() => Book)
  public async addAuthor(
    @Args({ name: 'bookId', type: () => ID }) bookId: number,
    @Args({ name: 'authorId', type: () => ID }) authorId: number,
  ): Promise<Book> {
    return await getConnection().transaction(
      async (entityManager: EntityManager) => {
        const book: Book = await entityManager.findOne(Book, bookId);

        if (!book) {
          throw new Error(`Book with id ${bookId} does not exist`);
        }

        await entityManager
          .createQueryBuilder()
          .relation(Book, 'authorsConnection')
          .of(book)
          .add(authorId);

        return book;
      },
    );
  }

  @Mutation(() => Int)
  public async deleteAuthor(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<number> {
    return await getConnection().transaction(
      async (entityManager: EntityManager) => {
        let affected = 0;
        const author: Author = await this._getAuthorById(entityManager, id);

        if (author) {
          await this.CatalogService.authorRepo
            .createQueryBuilder()
            .relation(Author, 'booksConnection')
            .of(author)
            .remove(author.booksConnection);
          affected += (await this.CatalogService.authorRepo.delete(id)).affected;
        }

        return affected;
      },
    );
  }

  @Mutation(() => Int)
  public async deleteAuthorWithBooks(
    @Args({ name: 'id', type: () => ID }) id: number,
  ): Promise<number> {
    return await getConnection().transaction(
      async (entityManager: EntityManager) => {
        let affectedTotal = 0;
        const author: Author = await this._getAuthorById(entityManager, id);

        if (author) {
          const booksIds: Book[] = await entityManager
            .createQueryBuilder(Book, 'books')
            .leftJoin('books_authors', 'ba', 'ba.bookId = id')
            .where((qb: SelectQueryBuilder<Author>) => {
              const subQuery: string = qb
                .subQuery()
                .select('bookId as id')
                .from('books_authors', 'ba')
                .groupBy('bookId')
                .having('count(authorId) = 1')
                .getQuery();

              return `id IN (${subQuery})`;
            })
            .orderBy('id')
            .getMany();

          affectedTotal += (await entityManager.delete(Book, booksIds))
            .affected;
          affectedTotal += author.booksConnection.length;

          await entityManager
            .createQueryBuilder()
            .relation(Author, 'booksConnection')
            .of(author)
            .remove(author.booksConnection);

          affectedTotal += (await entityManager.delete(Author, id)).affected;
        }

        return affectedTotal;
      },
    );
  }

  @ResolveProperty('books', () => [Book])
  public async books(
    @Parent() parent,
    @Context() { authorBooksLoader }: MyContext,
  ): Promise<Book[]> {
    return authorBooksLoader.load(parent.id);
  }
}
export default AuthorResolver;
