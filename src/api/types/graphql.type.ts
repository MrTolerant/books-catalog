import {
  bookAuthorsLoader,
  authorBooksLoader,
} from '../catalog.loader';

export interface MyContext {
  bookAuthorsLoader: ReturnType<typeof bookAuthorsLoader>;
  authorBooksLoader: ReturnType<typeof authorBooksLoader>;
}
