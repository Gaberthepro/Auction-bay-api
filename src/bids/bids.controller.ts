import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post(':id')
  create(@Body() createBidDto: CreateBidDto, @Param('id') auction_id:string) {
    return this.bidsService.create(createBidDto, +auction_id );
  }

  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  @Get(':id')
  bidHistory(@Param('id') id: string) {
    return this.bidsService.findAllbyAuctionId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidsService.update(+id, updateBidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidsService.remove(+id);
  }
}
