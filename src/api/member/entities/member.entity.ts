import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Borrow } from '../../borrow/entities/borrow.entity';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ name: 'is_penalized', default: false })
  isPenalized: boolean;

  @Column({ name: 'penalty_end_date', nullable: true })
  penaltyEndDate: Date | null;

  @OneToMany(() => Borrow, (borrow) => borrow.member)
  borrows: Borrow[];
}
