import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Auction } from './entities/auction.entity';
import { UserModule } from 'src/user/user.module';
import { Bid } from 'src/bids/entities/bid.entity';
import { BidsModule } from 'src/bids/bids.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auction, Bid]), UserModule],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
