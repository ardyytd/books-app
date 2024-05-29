import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Book } from '../../book/entities/book.entity';
import { Member } from '../../member/entities/member.entity';

@Entity('borrows')
export class Borrow {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'borrowed_at' })
  borrowedAt: Date;

  @Column({
    name: 'returned_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  returnedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeUpdate()
  private setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => Member, (member) => member.borrows)
  member: Member;

  @ManyToOne(() => Book, (book) => book.borrows)
  book: Book;
}
