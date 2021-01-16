import {
  bookAuthorsLoader,
  authorBooksLoader,
} from '../all.loader';

export interface IGraphQLContext {
  bookAuthorsLoader: ReturnType<typeof bookAuthorsLoader>;
  authorBooksLoader: ReturnType<typeof authorBooksLoader>;
}
