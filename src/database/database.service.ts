import { Injectable, Inject, Logger } from '@nestjs/common';
import { Knex } from 'knex';

const logger = new Logger('DatabaseService');

@Injectable()
export class DatabaseService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  // Example method to fetch data
  async getAllPrices() {
    return this.knex('price_history').select('*');
  }

  async addPrice(chain: string, price: number) {
    logger.log(`Adding price for ${chain}: ${price}`);
    return this.knex('price_history').insert({
      id: this.knex.raw('gen_random_uuid()'), // Generate UUID
      chain,
      price,
      timestamp: this.knex.fn.now(),
    });
  }
}
