import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Auction } from 'src/auctions/entities/auction.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuctionsModule } from 'src/auctions/auctions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, User, Auction]),
    UserModule,
    AuctionsModule,
  ],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
