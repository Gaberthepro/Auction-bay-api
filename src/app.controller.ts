import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local.auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateAuctionDto } from './auctions/dto/create-auction.dto';
import { AuctionsService } from './auctions/auctions.service';
import { UpdateAuctionDto } from './auctions/dto/update-auction.dto';
import { CreateBidDto } from './bids/dto/create-bid.dto';
import { BidsService } from './bids/bids.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly auctionsService: AuctionsService,
    private readonly bidsService: BidsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  logedinUser(@Request() req): string {
    return req.user;
  }

  @Post('/me/auction')
  PostAuction(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Put('/me/auction/:id')
  UpdateYourAuction(
    @Param('id') id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ) {
    return this.auctionsService.update(+id, updateAuctionDto);
  }

  @Post('/auctions/:id/bid')
  BidOnAuction(
    @Body() createBidDto: CreateBidDto,
    @Param('id') auction_id: string,
  ) {
    return this.bidsService.create(createBidDto, +auction_id);
  }
}
