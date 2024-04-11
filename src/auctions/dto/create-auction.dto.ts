import {
  IsNotEmpty,
  IsString,
  IsNumber,
  isNotEmpty,
  IsDate,
} from 'class-validator';
export class CreateAuctionDto {
  @IsNotEmpty({ message: 'Please provide title' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Please provide description' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Please provide Starting price' })
  @IsNumber()
  starting_price: number;

  @IsNotEmpty({ message: 'End date must be provided' })
  @IsDate()
  end_date: Date;

  @IsNotEmpty({ message: 'Auction without image this is 100% bullshit' })
  @IsString()
  imgURl: string;

  @IsNotEmpty()
  userId: number;
}
