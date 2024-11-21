import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoralisService } from './moralis/moralis.service';
import { PriceTrackerService } from './price-tracker/price-tracker.service';
import { DatabaseModule } from './database/database.module';
import { PriceService } from './price/price.service';
import { MailModule } from './mail/mail.module';
import { PriceController } from './price/price.controller';
import { AlertService } from './alert/alert.service';
import { AlertController } from './alert/alert.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    DatabaseModule,
    MailModule,
  ],
  controllers: [
    AppController,
    PriceController,
    AlertController,
  ],
  providers: [
    AppService,
    MoralisService,
    PriceTrackerService,
    PriceService,
    AlertService,
  ],
})
export class AppModule {}
