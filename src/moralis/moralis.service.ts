import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoralisService {
  private readonly apiUrl = 'https://deep-index.moralis.io/api/v2.2';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // Fetch ETH/USD Price (WETH on Ethereum) from Moralis
  async getEthereumPrice(): Promise<number> {
    let response;
    try {
      response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/erc20/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/price`,
          {
            params: {
              chain: 'eth', // Specifies the Ethereum chain
              include: 'percent_change', // Include percent change in the response
              exchange: 'uniswapv3', // Specifies the exchange
            },
            headers: {
              'X-API-Key': this.configService.get('MORALIS_API_KEY'),
            },
          },
        ),
      );
      //   console.log('Ethereum (WETH) Price Response:', response.data);
    } catch (error) {
      console.error('Error fetching Ethereum (WETH) price:', error);
    }

    return response?.data?.usdPrice;
  }

  // Fetch MATIC/USD Price from Moralis
  async getPolygonPrice(): Promise<number> {
    let response;
    try {
      response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/erc20/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/price`,
          {
            params: {
              chain: 'eth', // Specifies the Ethereum chain for MATIC
              include: 'percent_change', // Include percent change in the response
              exchange: 'uniswapv3', // Specifies the exchange
            },
            headers: {
              'X-API-Key': this.configService.get('MORALIS_API_KEY'),
            },
          },
        ),
      );
      //   console.log('Polygon (MATIC) Price Response:', response.data);
    } catch (error) {
      console.error('Error fetching Polygon (MATIC) price:', error);
    }

    return response?.data?.usdPrice;
  }
}
