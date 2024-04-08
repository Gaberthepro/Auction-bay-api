import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { AuctionsModule } from './auctions/auctions.module';
import { Auction } from './auctions/entities/auction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'gaber',
      username: 'postgres',
      entities: [User, Auction],
      database: 'auctionbay',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    AuctionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
