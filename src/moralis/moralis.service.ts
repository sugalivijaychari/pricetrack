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

  // Fetch ETH/USD Price (WETH on Polygon) from Moralis
  async getEthereumPrice(): Promise<number> {
    let response;
    try {
      response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/erc20/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/price`,
          {
            params: {
              chain: 'polygon', // Specifies the Polygon chain for WETH
              include: 'percent_change', // Include percent change in the response
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
          `${this.apiUrl}/erc20/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0/price`,
          {
            params: {
              chain: 'eth', // Specifies the Ethereum chain for MATIC
              include: 'percent_change', // Include percent change in the response
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
