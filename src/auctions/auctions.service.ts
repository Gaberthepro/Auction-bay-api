import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auction } from './entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Bid } from 'src/bids/entities/bid.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    private readonly userService: UserService,
  ) {}
  async create(createAuctionDto: CreateAuctionDto) {
    const { title, description, starting_price, end_date, imgURl, userId } =
      createAuctionDto;
    const auction = new Auction();
    auction.title = title;
    auction.description = description;
    auction.starting_price = starting_price;
    auction.end_date = end_date;
    auction.imgURl = imgURl;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    auction.user = user;

    return this.auctionRepository.save(auction);
  }

  findAllExceptYours(user_id: number): Promise<Auction[]> {
    const auctions = this.auctionRepository
      .createQueryBuilder('auction')
      .where('auction.userId != :userId', { userId: user_id })
      .andWhere('auction.end_date > NOW()')
      .orderBy('auction.end_date', 'ASC')
      .getMany();
    return auctions;
  }

  findAll(): Promise<Auction[]> {
    const auctions = this.auctionRepository.find({ relations: ['user'] });
    return auctions;
  }

  async findOne(id: number) {
    //const auction = this.auctionRepository.findOneBy({ id });
    /*const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ["user"]
    });*/
    const auction = await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.user', 'user')
      .select(['auction', 'user.id'])
      .where('auction.id = :id', { id: id })
      .getOne();
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  update(id: number, updateAuctionDto: UpdateAuctionDto) {
    return this.auctionRepository.update(id, updateAuctionDto);
  }

  async remove(id: number) {
    await this.bidRepository.delete({
      auction: {
        id: id,
      },
    });
    this.auctionRepository.delete({ id });
  }

  async updatePrice(id: number, new_price: number) {
    const auction = await this.findOne(id);
    auction.starting_price = new_price;
    this.auctionRepository.update(id, auction);
  }

  async myAuctions(user_id: number) {
    const myAuctions = this.auctionRepository.find({
      where: {
        user: {
          id: user_id,
        },
      },
      relations: ['user'],
      order: {
        end_date: 'ASC',
      },
    });
    return myAuctions;
  }
}
