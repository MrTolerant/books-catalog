import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
class BookDto {
  @Field(() => String)
  readonly title: string;

  @Field(() => [ID])
  readonly authorIds: number[];
}

export default BookDto;
