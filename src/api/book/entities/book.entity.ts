import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Borrow } from '../../borrow/entities/borrow.entity';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: 0 })
  stock: number;

  @OneToMany(() => Borrow, (borrow) => borrow.book)
  borrows: Borrow[];
}
