import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { Bid } from 'src/bids/entities/bid.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  surname: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  imgURl: string;

  @OneToMany(() => Auction, (auction) => auction.user)
  auction: Auction[];

  @OneToMany(() => Bid, (bid) => bid.user)
  bid: Bid[];
}
