import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
} from 'typeorm';
import Author from '../author/author.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'books', orderBy: { id: 'ASC' } })
@Unique(['title'])
export default class Book {
  constructor(title: string) {
    this.title = title;
  }

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column()
  title: string;

  @Field(() => [Author])
  authors: Author[];

  @ManyToMany(() => Author, (author) => author.booksConnection)
  authorsConnection: Author[];
}
