import { Auction } from 'src/auctions/entities/auction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  price: number;

  @ManyToOne(() => Auction, (auction) => auction.bid)
  auction: Auction;


  @ManyToOne(() => User, (user) => user.bid)
  user: User;
}
