import {
  bookAuthorsLoader,
  authorBooksLoader,
} from '../all.loader';

export interface MyContext {
  bookAuthorsLoader: ReturnType<typeof bookAuthorsLoader>;
  authorBooksLoader: ReturnType<typeof authorBooksLoader>;
}
