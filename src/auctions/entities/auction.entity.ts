import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Bid } from 'src/bids/entities/bid.entity';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric' })
  starting_price: number;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @Column({ type: 'varchar' })
  imgURl: string;

  @ManyToOne(() => User, (user) => user.auction)
  user: User;

  /*@OneToMany(() => Bid, (bid) => bid.auction)
  bid: Bid[];*/
}
