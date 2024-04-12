import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }

  @Get(':user_id')
  findAllExceptYours(@Param('user_id') user_id: string) {
    return this.auctionsService.findAllExceptYours(+user_id);
  }

  @Get('me/:user_id')
  myAuctions(@Param('user_id') user_id: string) {
    return this.auctionsService.myAuctions(+user_id);
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(+id, updateAuctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionsService.remove(+id);
  }
}
