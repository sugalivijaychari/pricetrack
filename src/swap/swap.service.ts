import { Injectable, Inject, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { CoinGeckoService } from '../coingecko/coingecko.service';

@Injectable()
export class SwapService {
  private readonly logger = new Logger(SwapService.name);

  constructor(
    @Inject('KnexConnection') private readonly knex: Knex,
    private readonly coingeckoService: CoinGeckoService,
  ) {}

  // Method to add a new swap fee for a specific chain and token
  async addSwapFee(chain: string, token: string, feePercentage: number) {
    try {
      // Check if a configuration already exists for the given chain and token
      const existingConfig = await this.knex('swap_fee_config')
        .where({ chain, token })
        .first();

      if (existingConfig) {
        this.logger.warn(`Swap fee already exists for ${chain} - ${token}`);
        return false;
      }

      // If no row exists, insert a new one
      await this.knex('swap_fee_config').insert({
        id: this.knex.raw('gen_random_uuid()'), // Generate UUID
        chain,
        token,
        fee_percentage: feePercentage,
      });
      this.logger.log(
        `Swap fee added for ${chain} - ${token} with fee: ${feePercentage}`,
      );
      return true;
    } catch (error) {
      this.logger.error('Failed to add swap fee', error);
      throw error;
    }
  }

  // Method to modify an existing swap fee percentage
  async modifySwapFee(chain: string, token: string, newFeePercentage: number) {
    try {
      // Check if a configuration already exists for the given chain and token
      const existingConfig = await this.knex('swap_fee_config')
        .where({ chain, token })
        .first();

      if (existingConfig) {
        // Update the existing row
        await this.knex('swap_fee_config')
          .update({ fee_percentage: newFeePercentage })
          .where('id', existingConfig.id);
        this.logger.log(
          `Swap fee percentage updated to: ${newFeePercentage} for ${chain} - ${token}`,
        );
        return true;
      } else {
        this.logger.warn(`Swap fee config not found for ${chain} - ${token}`);
        return false;
      }
    } catch (error) {
      this.logger.error('Failed to modify swap fee percentage', error);
      throw error;
    }
  }

  // Method to get the current swap fee percentage for a specific chain and token
  async getSwapFee(chain: string, token: string) {
    try {
      const result = await this.knex('swap_fee_config')
        .where({ chain, token })
        .first();

      return result ? parseFloat(result.fee_percentage) : null;
    } catch (error) {
      this.logger.error('Failed to fetch swap fee percentage', error);
      throw error;
    }
  }

  // Method to calculate the swap rate for ETH to BTC
  async calculateEthToBtcSwap(ethAmount: number): Promise<{
    btcAmount: number;
    feeInEth: number;
    feeInUsd: number;
  }> {
    try {
      // Get the ETH to BTC and USD rates using CoinGecko
      const { ethToBtc, ethToUsd } =
        await this.coingeckoService.getEthToBtcAndUsdRates();
      const chain = 'Ethereum';
      const token = 'ETH';

      // Get the swap fee percentage from the configuration (default 0.03)
      const feePercentage = await this.getSwapFee(chain, token);
      const feePercentageValue = feePercentage || 0.03; // Default to 0.03 if not configured

      const btcFee = ethToBtc * feePercentageValue;
      const btcReceivableAmount = ethToBtc - btcFee;

      // Calculate the equivalent ETH and USD fees using the CoinGecko service
      const { equivalentEth: feeInEth, equivalentUsd: feeInUsd } =
        await this.coingeckoService.calculateEquivalentEthAndUsdForBtc(btcFee);

      // Calculate the final BTC amount receivable after deducting the fee
      const btcAmount = ethAmount * btcReceivableAmount;

      return {
        btcAmount,
        feeInEth,
        feeInUsd,
      };
    } catch (error) {
      this.logger.error('Failed to calculate ETH to BTC swap', error);
      throw error;
    }
  }
}
