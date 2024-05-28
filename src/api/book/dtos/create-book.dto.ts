import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsNumber()
  stock: number;
}
