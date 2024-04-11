import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
export class CreateBidDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Make a price' })
  price: number;

  @IsDate()
  bid_date: Date;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  auctionId: number;
}
