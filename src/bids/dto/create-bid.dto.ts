import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
export class CreateBidDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Bid on new price' })
  price: number;

  @IsNotEmpty()
  bid_date: Date;

  @IsNotEmpty()
  userId: number;

}
