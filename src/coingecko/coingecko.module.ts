import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CoinGeckoService } from './coingecko.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CoinGeckoService],
  exports: [CoinGeckoService], // Export the service to use in other modules
})
export class CoinGeckoModule {} // Ensure it's spelled as "CoinGeckoModule"
