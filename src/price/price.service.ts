import { Injectable, Inject, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { HourlyPrice } from './interfaces/price.interface';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  // Method to get all prices from the PriceHistory table
  async getAllPrices() {
    this.logger.log('Fetching all prices from the PriceHistory table');
    try {
      const prices = await this.knex('price_history').select('*');
      this.logger.log('Successfully fetched all prices');
      return prices;
    } catch (error) {
      this.logger.error('Failed to fetch all prices', error);
      throw error;
    }
  }

  async getLatestPrice(chain: string) {
    this.logger.log(`Fetching latest price for chain: ${chain}`);
    try {
      const result = await this.knex('price_history')
        .where('chain', chain)
        .orderBy('timestamp', 'desc')
        .first();

      if (!result) {
        this.logger.warn(`No price data found for chain: ${chain}`);
        return null;
      }

      return result.price;
    } catch (error) {
      this.logger.error(
        `Database error when fetching price for ${chain}`,
        error,
      );
      throw error;
    }
  }

  // Get the price from one hour ago for a specific chain
  async getPriceOneHourAgo(chain: string) {
    this.logger.log(`Fetching price from one hour ago for chain: ${chain}`);
    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const result = await this.knex('price_history')
        .where('chain', chain)
        .andWhere('timestamp', '<=', oneHourAgo)
        .orderBy('timestamp', 'desc')
        .first();

      if (result) {
        this.logger.log(
          `Successfully fetched price from one hour ago for chain: ${chain}`,
        );
        return result.price;
      } else {
        this.logger.warn(
          `No price found from one hour ago for chain: ${chain}`,
        );
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch price from one hour ago for chain: ${chain}`,
        error,
      );
      throw error;
    }
  }

  async getHourlyPrices(chain: string): Promise<HourlyPrice[]> {
    this.logger.log(
      `Fetching hourly prices for the past 24 hours for chain: ${chain}`,
    );
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);

      // Group by hour and get the average price for each hour
      const rawPrices = await this.knex('price_history')
        .where('chain', chain)
        .andWhere('timestamp', '>=', oneDayAgo)
        .select(
          this.knex.raw(
            `DATE_TRUNC('hour', timestamp) as "hour", AVG(price) as "avg_price"`,
          ),
        )
        .groupBy(this.knex.raw(`DATE_TRUNC('hour', timestamp)`)) // Explicitly group by the truncated hour
        .orderBy('hour', 'asc');

      this.logger.log(`Successfully fetched hourly prices for chain: ${chain}`);

      // Cast each result to HourlyPrice format manually
      const hourlyPrices: HourlyPrice[] = rawPrices.map((price: any) => ({
        hour: new Date(price.hour), // Convert to Date object if necessary
        avg_price: price.avg_price ? price.avg_price.toString() : '0',
      }));

      return hourlyPrices;
    } catch (error) {
      this.logger.error(
        `Failed to fetch hourly prices for chain: ${chain}`,
        error,
      );
      throw error;
    }
  }

  // Method to add a new price entry
  async addPrice(chain: string, price: number) {
    this.logger.log(
      `Adding new price entry for chain: ${chain} with price: ${price}`,
    );
    try {
      await this.knex('price_history').insert({
        id: this.knex.raw('gen_random_uuid()'), // Generate UUID
        chain,
        price,
        timestamp: this.knex.fn.now(),
      });
      this.logger.log(`Successfully added new price entry for chain: ${chain}`);
    } catch (error) {
      this.logger.error(
        `Failed to add new price entry for chain: ${chain}`,
        error,
      );
      throw error;
    }
  }
}
