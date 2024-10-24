import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('swap_rate', (table) => {
    table.uuid('id').primary();
    table.decimal('eth_amount', 20, 8).notNullable(); // Amount in ETH
    table.decimal('btc_amount', 20, 8).notNullable(); // Equivalent in BTC
    table.decimal('fee_eth', 20, 8).notNullable(); // Fee in ETH
    table.decimal('fee_usd', 20, 8).notNullable(); // Fee in USD
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('swap_rate');
}
