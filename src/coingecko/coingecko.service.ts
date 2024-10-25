import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CoinGeckoService {
  private readonly logger = new Logger(CoinGeckoService.name);
  private readonly coingeckoUrl =
    'https://api.coingecko.com/api/v3/simple/price';

  constructor() {}

  // Method to fetch ETH to BTC and ETH to USD prices using CoinGecko
  async getEthToBtcAndUsdRates(): Promise<{
    ethToBtc: number;
    ethToUsd: number;
  }> {
    try {
      const response = await axios.get(this.coingeckoUrl, {
        params: {
          ids: 'ethereum',
          vs_currencies: 'btc,usd',
        },
      });

      const ethToBtc = response.data.ethereum.btc;
      const ethToUsd = response.data.ethereum.usd;

      this.logger.log(
        `Fetched ETH to BTC rate: ${ethToBtc}, ETH to USD rate: ${ethToUsd}`,
      );
      return { ethToBtc, ethToUsd };
    } catch (error) {
      this.logger.error(
        'Failed to fetch ETH to BTC and USD rates from CoinGecko',
        error,
      );
      throw error;
    }
  }

  // Method to fetch BTC to ETH and USD prices using CoinGecko
  async getBtcToEthAndUsdRates(): Promise<{
    btcToEth: number;
    btcToUsd: number;
  }> {
    try {
      const response = await axios.get(this.coingeckoUrl, {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'eth,usd',
        },
      });

      const btcToEth = response.data.bitcoin.eth;
      const btcToUsd = response.data.bitcoin.usd;

      this.logger.log(
        `Fetched BTC to ETH rate: ${btcToEth}, BTC to USD rate: ${btcToUsd}`,
      );
      return { btcToEth, btcToUsd };
    } catch (error) {
      this.logger.error(
        'Failed to fetch BTC to ETH and USD rates from CoinGecko',
        error,
      );
      throw error;
    }
  }

  // Method to calculate the equivalent ETH and USD for a given BTC amount
  async calculateEquivalentEthAndUsdForBtc(
    btcAmount: number,
  ): Promise<{ equivalentEth: number; equivalentUsd: number }> {
    try {
      const { btcToEth, btcToUsd } = await this.getBtcToEthAndUsdRates();

      // Calculate equivalent ETH and USD
      const equivalentEth = btcAmount * btcToEth;
      const equivalentUsd = btcAmount * btcToUsd;

      this.logger.log(
        `Calculated equivalent for ${btcAmount} BTC: ${equivalentEth} ETH, $${equivalentUsd} USD`,
      );

      return { equivalentEth, equivalentUsd };
    } catch (error) {
      this.logger.error(
        'Failed to calculate equivalent ETH and USD for the given BTC amount',
        error,
      );
      throw error;
    }
  }
}
