import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid } from './entities/bid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { AuctionsService } from 'src/auctions/auctions.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepository: Repository<Bid>,
    private readonly userService: UserService,
    private readonly auctionService: AuctionsService,
  ) {}
  async create(createBidDto: CreateBidDto) {
    const bid = new Bid();
    const { price, bid_date, userId, auctionId } = createBidDto;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const auction = await this.auctionService.findOne(auctionId);
    if (!auctionId) {
      throw new NotFoundException('Auction not found');
    }
    bid.price = price;
    bid.bid_date = bid_date;
    bid.auction = auction;
    bid.user = user;
    return this.bidRepository.save(bid);
  }

  findAll() {
    return `This action returns all bids`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bid`;
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    return `This action updates a #${id} bid`;
  }

  remove(id: number) {
    return `This action removes a #${id} bid`;
  }
}
