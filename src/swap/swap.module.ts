import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';
import { CoinGeckoModule } from '../coingecko/coingecko.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [CoinGeckoModule, DatabaseModule],
  controllers: [SwapController],
  providers: [SwapService],
})
export class SwapModule {}
