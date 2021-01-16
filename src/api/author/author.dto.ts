import { Field, InputType } from '@nestjs/graphql';

@InputType()
class AuthorDto {
  @Field(() => String)
  readonly firstName: string;

  @Field(() => String)
  readonly lastName: string;
}

export default AuthorDto;
