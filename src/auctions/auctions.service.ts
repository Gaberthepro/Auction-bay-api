import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auction } from './entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
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
      .orderBy('auction.end_date', 'DESC')
      .getMany();
    return auctions;
  }

  findAll(): Promise<Auction[]> {
    const auctions = this.auctionRepository.find();
    return auctions;
  }

  findOne(id: number) {
    const auction = this.auctionRepository.findOneBy({ id });
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  update(id: number, updateAuctionDto: UpdateAuctionDto) {
    return this.auctionRepository.update(id, updateAuctionDto);
  }

  remove(id: number) {
    this.auctionRepository.delete({ id });
  }
}
