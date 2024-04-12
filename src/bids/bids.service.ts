import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid } from './entities/bid.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { AuctionsService } from 'src/auctions/auctions.service';
import * as moment from 'moment';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepository: Repository<Bid>,
    private readonly userService: UserService,
    private readonly auctionService: AuctionsService,
  ) {}
  async create(createBidDto: CreateBidDto, auctionId: number) {
    const bid = new Bid();
    const { price, bid_date, userId } = createBidDto;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const auction = await this.auctionService.findOne(auctionId);
    if (!auctionId) {
      throw new NotFoundException('Auction not found');
    }

    if (moment(auction.end_date).isBefore(moment())) {
      throw new BadRequestException('This auction is over', {
        cause: new Error(),
      });
    }

    if (auction.user.id == userId) {
      throw new BadRequestException('You cannot bid on your own auction', {
        cause: new Error(),
      });
    }

    if (price <= auction.starting_price) {
      throw new BadRequestException('You must bid more then current price', {
        cause: new Error(),
      });
    }

    bid.price = price;
    bid.bid_date = bid_date;
    bid.auction = auction;
    bid.user = user;

    this.auctionService.updatePrice(auctionId, bid.price);
    return this.bidRepository.save(bid);
  }

  findAll() {
    const bids = this.bidRepository.find({
      relations: ['auction', 'user'],
      order: {
        price: 'DESC',
      },
    });
    return bids;
  }

  findAllbyAuctionId(auction_id: number) {
    const bids = this.bidRepository.find({
      where: {
        auction: {
          id: auction_id,
        },
      },
      relations: ['auction', 'user'],
      order: {
        price: 'DESC',
      },
    });

    return bids;
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

  async myBidding(user_id: number) {
    const currentDate = moment().toDate();
    const myBids = this.bidRepository.find({
      where: {
        user: {
          id: user_id,
        },
        auction: {
          end_date: MoreThan(currentDate),
        },
      },
      relations: ['auction'],
      order: {
        bid_date: 'DESC',
      },
    });
    const uniqueBidsByAuction = (await myBids).reduce((acc, current) => {
      const x = acc.find((item) => item.auction.id === current.auction.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    const uniqueAuctions = uniqueBidsByAuction.map((bid) => bid.auction);
    return uniqueAuctions;
  }

  async won(user_id: number) {
    const highestBids = await this.bidRepository
      .createQueryBuilder('bid')
      .leftJoin('bid.auction', 'auction')
      .select('MAX(bid.price)', 'price')
      .addSelect('bid.auctionId')
      .where('bid.userId = :userId', { userId: user_id })
      .andWhere('auction.end_date < CURRENT_TIMESTAMP')
      .groupBy('bid.auctionId')
      .getRawMany();

    const auctionIds = (await highestBids).map((bid) => bid.auctionId);
    const auctionWinsPromises = auctionIds.map((auctionId) =>
      this.auctionService.findOne(auctionId),
    );
    const auctionsWon = await Promise.all(auctionWinsPromises);
    return auctionsWon;
  }
}
